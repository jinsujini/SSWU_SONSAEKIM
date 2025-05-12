exports.showQuizSelect = (req, res) => {
    res.render('quiz/quizMenu');
  };
  
exports.showQuiz = (req, res) => {
  res.render('quiz/quizPage');
};

exports.showResult = (req, res) => {
  res.render('quiz/quizResult');
};

exports.showWrongAnswers = (req, res) => {
  res.render('quiz/quizWrong');
};