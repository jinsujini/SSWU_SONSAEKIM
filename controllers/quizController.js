const { User, Quiz, SignWord, SignVc, BookmarkWord, VcWrong, WordWrong} = require('../models');

exports.showQuizSelect = (req, res) => {
    res.render('quiz/quizMenu');
  };

exports.showQuiz = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const userId = req.session.user?.user_id;

    const type = req.params.type; // phoneme 또는 word
    const isPhoneme = type === 'phoneme';

    let excludedIds = [];

    // 맞은 문제 빼고 퀴즈 가져오기
    if (userId) {
      if (isPhoneme) {
        const relearned = await VcWrong.findAll({
          attributes: ['vc_id'],
          where: {
            user_id: userId,
            is_relearned: true,
          },
          raw: true
        });
        excludedIds = relearned.map(r => r.vc_id);
      } else {
        const relearned = await WordWrong.findAll({
          attributes: ['word_id'],
          where: {
            user_id: userId,
            is_relearned: true,
          },
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

    if (quizList.length === 0) {
        return res.render('quiz/noQuiz', {
        });
      }

    const enrichedQuizList = await Promise.all(
      quizList.map(async (quiz) => {
        let image = '';

        if (quiz.source_type === 'sign_word') {
          const word = await SignWord.findByPk(quiz.source_id);
          image = word?.image || '';
        } else if (quiz.source_type === 'sign_vc') {
          const vc = await SignVc.findByPk(quiz.source_id);
          image = vc?.image || '';
        }

        return {
          ...quiz.toJSON(),
          image
        };
      })
    );

    res.render('quiz/quizPage', {
      quizList: enrichedQuizList,
      quizTitle: type === 'phoneme' ? '모음/자음 퀴즈' : '단어/표현 퀴즈'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('퀴즈 로딩 실패');
  }
};

exports.saveQuizResults = async (req, res) => {
  const userId = req.session.user?.user_id;
  const { quizResults } = req.body;

  if (!userId) return res.status(401).json({ message: '로그인이 필요합니다.' });

  try {
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
          if (result.is_relearned && !existing.is_relearned) {
            await WordWrong.update(common, { where });
          }
        } else {
          await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common });
        }
      } else if (result.source_type === 'sign_vc') {
        const where = { user_id: userId, vc_id: result.source_id };
        const existing = await VcWrong.findOne({ where });

        if (existing) {
          if (result.is_relearned && !existing.is_relearned) {
            await VcWrong.update(common, { where });
          }
        } else {
          await VcWrong.create({ user_id: userId, vc_id: result.source_id, ...common });
        }
      }
    }

    res.json({ message: '저장 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '저장 실패' });
  }
};

exports.showResult = (req, res) => {
  res.render('quiz/quizResult');
};

exports.showWrongAnswers = async (req, res) => {
  const type = req.query.type;

  if (type === 'collected') {
    const userId = req.session.user?.user_id;
    if (!userId) return res.redirect('/login');

    const vcWrongs = await VcWrong.findAll({
      where: { user_id: userId, is_relearned: false },
      include: [SignVc],
      limit: 10
    });

    const wordWrongs = await WordWrong.findAll({
      where: { user_id: userId, is_relearned: false },
      include: [SignWord],
      limit: 10
    });

    const wrongAnswers = [...vcWrongs, ...wordWrongs].map(entry => {
      const isVc = !!entry.vc_id;

      return {
        source_id: isVc ? entry.vc_id : entry.word_id,
        source_type: isVc ? 'sign_vc' : 'sign_word',
        image: isVc ? entry.SignVc?.image || '' : entry.SignWord?.image || '',
        option1: entry.option1,
        option2: entry.option2,
        option3: entry.option3,
        option4: entry.option4,
        answer: entry.answer,
        selected: entry.selected ?? 0,
        is_relearned: entry.is_relearned ?? false,
        is_follow: entry.is_follow ?? false
      };
    });

    return res.render('quiz/quizWrong', { wrongAnswers });
  }

  res.render('quiz/quizWrong'); // 로컬스토리지 기반
};

exports.toggleBookmark = async (req, res) => {
  try {
    const userId = req.session.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { wordId } = req.body;

    const existing = await BookmarkWord.findOne({
      where: { userId, wordId }
    });

    if (existing) {
      await BookmarkWord.destroy({ where: { userId, wordId } });
      return res.json({ status: 'removed' });
    } else {
      await BookmarkWord.create({ userId, wordId });
      return res.json({ status: 'added' });
    }

  } catch (err) {
    console.error('북마크 처리 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.showQuizNone = (req, res) => {
  res.render('quiz/noQuiz');
};