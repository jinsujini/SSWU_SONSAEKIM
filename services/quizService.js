const { Quiz, SignWord, SignVc, BookmarkWord, BookmarkVc, VcWrong, WordWrong } = require('../models');
const { Sequelize } = require('../models');

exports.getQuizList = async (type, userId) => {
    const { Op } = require('sequelize');
    const isPhoneme = type === 'phoneme';

    let excludedIds = [];
    if (userId) {
        if (isPhoneme) {
        const relearned = await VcWrong.findAll({
            attributes: ['vc_id'],
            where: { user_id: userId, is_relearned: true },
            raw: true
        });
        excludedIds = relearned.map(r => r.vc_id);
        } else {
        const relearned = await WordWrong.findAll({
            attributes: ['word_id'],
            where: { user_id: userId, is_relearned: true },
            raw: true
        });
        excludedIds = relearned.map(r => r.word_id);
        }
    }

    const quizList = await Quiz.findAll({
        where: {
        source_type: isPhoneme ? 'sign_vc' : 'sign_word',
        source_id: {
            [Op.notIn]: excludedIds.length > 0 ? excludedIds : [0],
        }
        },
        order: Quiz.sequelize.random(),
        limit: 10
    });

    const enrichedQuizList = await Promise.all(
        quizList.map(async (quiz) => {
        let image = '';
        let is_bookmarked = false;

        if (quiz.source_type === 'sign_word') {
            const word = await SignWord.findByPk(quiz.source_id);
            image = word?.image || '';
            if (userId) {
            const bookmark = await BookmarkWord.findOne({
                where: { user_id: userId, word_id: quiz.source_id }
            });
            is_bookmarked = !!bookmark;
            }
        } else if (quiz.source_type === 'sign_vc') {
            const vc = await SignVc.findByPk(quiz.source_id);
            image = vc?.image || '';
            if (userId) {
            const bookmark = await BookmarkVc.findOne({
                where: { user_id: userId, vc_id: quiz.source_id }
            });
            is_bookmarked = !!bookmark;
            }
        }

        return {
            ...quiz.toJSON(),
            image,
            is_bookmarked
        };
        })
    );

    return enrichedQuizList;
};

exports.saveQuizResults = async (userId, quizResults) => {
    for (const result of quizResults) {
        const common = {
        is_follow: result.is_follow ?? false,
        is_relearned: result.is_relearned ?? false,
        selected: typeof result.selected === 'number' ? result.selected : 0,
        option1: result.option1,
        option2: result.option2,
        option3: result.option3,
        option4: result.option4,
        answer: result.answer,
        created_at: new Date()
        };

        if (result.source_type === 'sign_word') {
        const where = { user_id: userId, word_id: result.source_id };
        const existing = await WordWrong.findOne({ where });

        if (existing) {
            await WordWrong.update(common, { where });
        } else {
            await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common });
        }
        } else if (result.source_type === 'sign_vc') {
        const where = { user_id: userId, vc_id: result.source_id };
        const existing = await VcWrong.findOne({ where });

        if (existing) {
            await VcWrong.update(common, { where });
        } else {
            await VcWrong.create({ user_id: userId, vc_id: result.source_id, ...common });
        }
        }
    }
};

exports.getWrongAnswers = async (userId) => {
    const totalCount = 10;
    let vcCount = Math.floor(Math.random() * (totalCount + 1));
    let wordCount = totalCount - vcCount;

    let vcWrongs = await VcWrong.findAll({
        where: { user_id: userId, is_relearned: false },
        include: [SignVc],
        order: Sequelize.literal('RAND()'),
        limit: vcCount
    });

    let wordWrongs = await WordWrong.findAll({
        where: { user_id: userId, is_relearned: false },
        include: [SignWord],
        order: Sequelize.literal('RAND()'),
        limit: wordCount
    });

    if (vcWrongs.length + wordWrongs.length < totalCount) {
        const remaining = totalCount - (vcWrongs.length + wordWrongs.length);

        if (vcWrongs.length < vcCount) {
        const extraWords = await WordWrong.findAll({
            where: {
            user_id: userId,
            is_relearned: false,
            word_wrong_id: { [Sequelize.Op.notIn]: wordWrongs.map(w => w.id) }
            },
            include: [SignWord],
            order: Sequelize.literal('RAND()'),
            limit: remaining
        });
        wordWrongs = wordWrongs.concat(extraWords);
        } else {
        const extraVcs = await VcWrong.findAll({
            where: {
            user_id: userId,
            is_relearned: false,
            vc_wrong_id: { [Sequelize.Op.notIn]: vcWrongs.map(v => v.id) }
            },
            include: [SignVc],
            order: Sequelize.literal('RAND()'),
            limit: remaining
        });
        vcWrongs = vcWrongs.concat(extraVcs);
        }
    }

    const combined = [...vcWrongs, ...wordWrongs];
    const shuffled = combined.sort(() => Math.random() - 0.5);

    const wrongAnswers = [];

    for (const entry of shuffled) {
        const isVc = !!entry.vc_id;
        const source_id = isVc ? entry.vc_id : entry.word_id;
        const source_type = isVc ? 'sign_vc' : 'sign_word';

        let isBookmarked = false;
        if (source_type === 'sign_word') {
        const bookmark = await BookmarkWord.findOne({ where: { user_id: userId, word_id: source_id } });
        isBookmarked = !!bookmark;
        } else {
        const bookmark = await BookmarkVc.findOne({ where: { user_id: userId, vc_id: source_id } });
        isBookmarked = !!bookmark;
        }

        wrongAnswers.push({
        source_id,
        source_type,
        image: isVc ? entry.SignVc?.image || '' : entry.SignWord?.image || '',
        option1: entry.option1,
        option2: entry.option2,
        option3: entry.option3,
        option4: entry.option4,
        answer: entry.answer,
        selected: entry.selected ?? 0,
        is_relearned: entry.is_relearned ?? false,
        is_follow: entry.is_follow ?? false,
        is_bookmarked: isBookmarked
        });
    }

    return wrongAnswers;
};

exports.toggleBookmark = async (userId, sourceType, sourceId) => {
    if (sourceType === 'sign_word') {
        const existing = await BookmarkWord.findOne({ where: { user_id: userId, word_id: sourceId } });

        if (existing) {
        await BookmarkWord.destroy({ where: { user_id: userId, word_id: sourceId } });
        return 'removed';
        } else {
        await BookmarkWord.create({ user_id: userId, word_id: sourceId });
        return 'added';
        }
    } else if (sourceType === 'sign_vc') {
        const existing = await BookmarkVc.findOne({ where: { user_id: userId, vc_id: sourceId } });

        if (existing) {
        await BookmarkVc.destroy({ where: { user_id: userId, vc_id: sourceId } });
        return 'removed';
        } else {
        await BookmarkVc.create({ user_id: userId, vc_id: sourceId });
        return 'added';
        }
    } else {
        throw new Error('유효하지 않은 sourceType입니다.');
    }
};