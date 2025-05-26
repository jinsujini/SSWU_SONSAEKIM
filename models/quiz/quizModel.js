const { Quiz, sequelize } = require('../../models');

exports.getRandomQuizzes = async () => {
  try {
    const quizzes = await Quiz.findAll({
      order: sequelize.random(), // 랜덤 정렬
      limit: 10
    });
    return quizzes;
  } catch (err) {
    throw err;
  }
}