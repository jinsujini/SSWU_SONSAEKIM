const gameService = require('../services/gameService');

exports.getImages = async (req, res) => {
  try {
    const result = await gameService.getRandomImages();
    res.json(result);
  } catch (error) {
    console.error('랜덤 수어 이미지 불러오기 실패', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.gameStart = async (req, res) => {
  try {
    const top3 = await gameService.getTop3Records();
    res.render('game/start', { top3 });
  } catch (err) {
    console.error(err);
    res.status(500).send('랭킹 정보 로드 중 오류 발생');
  }
};

exports.gamePlay = (req, res) => {
  try {
    res.render('game/play');
  } catch (err) {
    console.error(err);
    res.status(500).send('게임 화면로드 중 오류 발생');
  }
};

exports.createGameRecord = async (req, res) => {
  const userId = req.session?.user?.user_id;
  const score = req.body.score;

  if (!userId) {
    return res.status(401).json({ err: '로그인한 사용자만 기록을 남길 수 있습니다.' });
  }

  try {
    const record = await gameService.createRecord(userId, score);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '게임 기록 저장 중 오류 발생' });
  }
};

exports.getAllGameRecords = async (req, res) => {
  try {
    const records = await gameService.getAllRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: '기록 가져오기 실패' });
  }
};

exports.getTop3 = async (req, res) => {
  try {
    const top3 = await gameService.getTop3Records();
    res.json(top3);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '랭킹 조회 실패' });
  }
};

exports.getMyBestScore = async (req, res) => {
  const userId = req.session?.user?.user_id;

  if (!userId) {
    return res.status(401).json({ error: '로그인 필요' });
  }

  try {
    const topScore = await gameService.getUserTopScore(userId);
    res.json({ score: topScore || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '최고 점수 조회 실패' });
  }
};
