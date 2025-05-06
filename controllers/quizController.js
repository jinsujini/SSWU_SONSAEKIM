exports.showQuizSelect = (req, res) => {
    res.render('quiz/quizMenu');
  };
  
exports.showQuizPhoneme = (req, res) => {
  res.render('quiz/quizPhoneme');
};

exports.showResult = (req, res) => {
  res.render('quiz/quizResult');
};

exports.showWrongAnswers = (req, res) => {
  res.render('quiz/quizWrong');
};