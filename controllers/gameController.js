const { GameRecord } = require('../models');

exports.gameStart = async (req, res) => {
  try {
    const top3 = await GameRecord.findAll({
      order: [['score', 'DESC']],
      limit: 3,
    });
    console.log('Top3 records:', top3); 
    res.render('game/start', { top3 });
  } catch (err) {
    console.error(err);
    res.status(500).send('랭킹 정보를 가져오는 중 오류가 발생했습니다.');
  }
};
exports.gamePlay = (req, res) => {
  res.render('game/play');
};

exports.createGameRecord = async (req, res) => {
  try {
    const record = await GameRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create record' });
  }
};

exports.getAllGameRecords = async (req, res) => {
  try {
    const records = await GameRecord.findAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching records' });
  }
};