const { Quiz, SignWord, SignVc, BookmarkWord, BookmarkVc, VcWrong, WordWrong } = require('../models');
const { Sequelize } = require('../models');

exports.getQuizList = async (type, userId) => {
    const { Op } = require('sequelize');
    const isPhoneme = type === 'phoneme';

    const quizList = await Quiz.findAll({
        where: {
            source_type: isPhoneme ? 'sign_vc' : 'sign_word',
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
            created_at: new Date()
        };

        if (result.source_type === 'sign_word') {
            const where = { user_id: userId, word_id: result.source_id };
            const existing = await WordWrong.findOne({ where });

            if (existing) {
                if (
                    existing.is_relearned !== common.is_relearned ||
                    existing.is_follow !== common.is_follow
                ) {
                    await WordWrong.update(common, { where });
                }
            } else {
                await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common });
            }
        } else if (result.source_type === 'sign_vc') {
            const where = { user_id: userId, vc_id: result.source_id };
            const existing = await VcWrong.findOne({ where });

            if (existing) {
                if (
                    existing.is_relearned !== common.is_relearned ||
                    existing.is_follow !== common.is_follow
                ) {
                    await VcWrong.update(common, { where });
                }
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
        order: Sequelize.literal('RAND()'),
        limit: vcCount
    });
    const vcSourceIds = vcWrongs.map(v => v.vc_id);

    let wordWrongs = await WordWrong.findAll({
        where: { user_id: userId, is_relearned: false },
        order: Sequelize.literal('RAND()'),
        limit: wordCount
    });
    const wordSourceIds = wordWrongs.map(w => w.word_id);

    if (vcSourceIds.length + wordSourceIds.length < totalCount) {
        const remaining = totalCount - (vcSourceIds.length + wordSourceIds.length);

        if (vcSourceIds.length < vcCount) {
            const extraWords = await WordWrong.findAll({
                where: {
                    user_id: userId,
                    is_relearned: false,
                    word_wrong_id: { [Sequelize.Op.notIn]: wordWrongs.map(w => w.id) }
                },
                order: Sequelize.literal('RAND()'),
                limit: remaining
            });
            wordWrongs = wordWrongs.concat(extraWords);
            wordSourceIds.push(...extraWords.map(w => w.word_id));
        } else {
            const extraVcs = await VcWrong.findAll({
                where: {
                    user_id: userId,
                    is_relearned: false,
                    vc_wrong_id: { [Sequelize.Op.notIn]: vcWrongs.map(v => v.id) }
                },
                order: Sequelize.literal('RAND()'),
                limit: remaining
            });
            vcWrongs = vcWrongs.concat(extraVcs);
            vcSourceIds.push(...extraVcs.map(v => v.vc_id));
        }
    }

    const vcQuizList = await Quiz.findAll({
        where: {
            source_type: 'sign_vc',
            source_id: {
                [Sequelize.Op.in]: vcSourceIds
            }
        },
        order: Quiz.sequelize.random(),
        limit: vcSourceIds.length
    });

    const wordQuizList = await Quiz.findAll({
        where: {
            source_type: 'sign_word',
            source_id: {
                [Sequelize.Op.in]: wordSourceIds
            }
        },
        order: Quiz.sequelize.random(),
        limit: wordSourceIds.length
    });

    let quizList = [...vcQuizList, ...wordQuizList].sort(() => Math.random() - 0.5);

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