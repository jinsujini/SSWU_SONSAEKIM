const { User, Quiz, SignWord, SignVc, BookmarkWord } = require('../models');

exports.showQuizSelect = (req, res) => {
    res.render('quiz/quizMenu');
  };

exports.showQuiz = async (req, res) => {
  try {
    const type = req.params.type; // phoneme 또는 word
    
    const quizList = await Quiz.findAll({
      where: type === 'phoneme' 
        ? { source_type: 'sign_vc' }
        : { source_type: 'sign_word' },
      order: Quiz.sequelize.random(),
      limit: 10
    });

    res.render('quiz/quizPage', {
      quizList,
      quizTitle: type === 'phoneme' ? '모음/자음 퀴즈' : '단어/표현 퀴즈'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('퀴즈 로딩 실패');
  }
};

exports.showResult = (req, res) => {
  res.render('quiz/quizResult');
};

exports.showWrongAnswers = (req, res) => {
  res.render('quiz/quizWrong');
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