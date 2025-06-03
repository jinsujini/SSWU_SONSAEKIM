const { GameRecord, User } = require('../models');


exports.gameStart = async (req, res) => {
  try {
    const top3 = await GameRecord.findAll({
      order: [['score', 'DESC']],
      limit: 3,
      include: [
        {
          model: User,
          attributes: ['name'], // 사용자 이름만 가져옴
          required: true
        }
      ]
    });

    console.log('Top3 records:', top3); 
    res.render('game/start', { top3 });
  } catch (err) {
    console.error(err);
    res.status(500).send('랭킹 정보를 가져오는 중 오류가 발생했습니다.');
  }
};

exports.gamePlay = async (req, res) => {
  try {
    res.render('game/play');
  } catch (err) {
    console.error(err);
    res.status(500).send('게임 화면을 불러오는 중 오류가 발생했습니다.');
  }
};


exports.createGameRecord = async (req, res) => {
  console.log('세션:', req.session);
  try {
    const userId = req.session?.user?.user_id;
    if(!userId){
      return res.status(401).json({err: '로그인한 사용자만 기록을 남길 수 있습니다.'})
    }
    const score = req.body.score;
    const record = await GameRecord.create({
      user_id: userId,
      score: score
    });
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '게임 기록 저장 중 오류 발생. 다시 시도해 주세요.' });
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

exports.getTop3 = async (req, res) => {
  try {
    const top3 = await GameRecord.findAll({
      order: [['score', 'DESC']],
      limit: 3,
      include: [{
        model: User,
        attributes: ['name'],
        required: true
      }]
    });
    res.json(top3);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '랭킹 조회 실패' });
  }
};

exports.getMyBestScore = async (req, res) => {
  const userId = req.session?.user?.user_id;
  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    const topScore = await GameRecord.max('score', {
      where: { user_id: userId }
    });

    res.json({ score: topScore || 0 }); // 기록 없을 경우 0 반환
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '최고 점수 조회 실패' });
  }
};