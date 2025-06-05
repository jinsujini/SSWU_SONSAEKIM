const { GameRecord, User, SignWord, SignVc, sequelize } = require('../models');

exports.getRandomImages = async () => {
  const wordSamples = await SignWord.findAll({
    order: sequelize.random(),
    limit: 5
  });

  const vcSamples = await SignVc.findAll({
    order: sequelize.random(),
    limit: 5
  });

  return [...wordSamples, ...vcSamples].map((item) => ({
    image: item.image,
    value: item.description
  }));
};

exports.getTop3Records = async () => {
  return await GameRecord.findAll({
    order: [['score', 'DESC']],
    limit: 3,
    include: [{ model: User, attributes: ['name'], required: true }]
  });
};

exports.createRecord = async (userId, score) => {
  return await GameRecord.create({ user_id: userId, score });
};

exports.getAllRecords = async () => {
  return await GameRecord.findAll();
};

exports.getUserTopScore = async (userId) => {
  return await GameRecord.max('score', { where: { user_id: userId } });
};
