const quizModel = require('../models/quiz/quizModel.js');

exports.showQuizSelect = (req, res) => {
    res.render('quiz/quizMenu');
  };
  
exports.showQuiz = async (req, res) => {
  try {
    const quizList = await quizModel.getRandomQuizzes();
    res.render('quiz/quizPage', { quizList });
  } catch (err) {
    console.error(err); 
    res.status(500).send('퀴즈 불러오기 실패');
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
    const userId = req.session.user?.id;
    const { wordId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

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