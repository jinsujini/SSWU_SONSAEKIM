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