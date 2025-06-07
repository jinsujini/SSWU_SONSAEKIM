const imitateService = require('../services/imitateService');

exports.showImitateSelect = (req, res) => {
  res.render('imitate/imitateSelect');
};

exports.showImitate = async (req, res) => {
  try {
    const type = req.params.type;
    const enrichedImitateList = await imitateService.getImitateList(type);

    res.render('imitate/imitatePage', {
      enrichedImitateList,
      type
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('따라하기 로딩 실패');
  }
};

exports.handlePrediction = async (req, res) => {
  const imagePath = req.file.path;
  const correctClass = parseInt(req.body.correctClass, 10);

  try {
    const result = await imitateService.runPrediction(imagePath, correctClass);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.showImitateResult = (req, res) => {
  const { type, correctCount } = req.params;
  res.render('imitate/imitateResult', { type, correctCount });
};

exports.saveImitateResult = async (req, res) => {
  const userId = req.session.user?.user_id;
  const { imitateResults } = req.body;

  try {
    await imitateService.saveImitateResults(userId, imitateResults);
    res.json({ message: '결과 저장 완료' });
  } catch (err) {
    console.error(err);
    if (err.message === '로그인이 필요합니다.') {
      res.status(401).json({ message: err.message });
    } else {
      res.status(500).json({ message: '결과 저장 실패' });
    }
  }
};

exports.showImitateWrong = (req, res) => {
  const { type } = req.params;
  res.render('imitate/imitateWrong', { type });
};
