
const { runPythonPrediction } = require('../lib/pythonCaller');

exports.handlePrediction = (req, res) => {
  const imagePath = req.file.path;
  const correctClass = parseInt(req.body.correctClass, 10);

  runPythonPrediction(imagePath, (err, predictedClass) => {
    if (err || isNaN(predictedClass)) {
      return res.status(500).json({ error: '예측 실패' });
    }

    res.json({
      predictedClass,
      isCorrect: predictedClass === correctClass
    });
  });
};

exports.showImitateSelect = (req, res) => {
  res.render('imitate/imitate');
};

exports.showVowel = (req, res) => {
  res.render('imitate/vowel');
};

exports.showConsonant = (req, res) => {
  res.render('imitate/consonant');
};

exports.showVowelResult = (req, res) => {
  res.render('imitate/vowelResult');
};
const {SignVc} = require('../models');
const { Op } = require('sequelize');

exports.showImitateSelect = (req, res) => {
    res.render('imitate/imitateSelect');
  };
  
exports.showImitate =  async (req, res) => {
    try {
      const type = req.params.type;

      const imitateList = await SignVc.findAll({
        where: type === 'vowel' 
          ? { vc_id: { [Op.lte]: 10 } }
          : { vc_id: { [Op.gt]: 10 } },
        order: SignVc.sequelize.random(),         
        limit: 10
      });

      const enrichedImitateList = imitateList.map(item => ({
        ...item.toJSON(),
        image: item.image || '' 
      }));
  
      res.render('imitate/imitatePage', {
        enrichedImitateList,
        type
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('따라하기 로딩 실패');
    }
  };

  exports.showImitateResult = (req, res) => {
    const { type } = req.query;

    res.render('imitate/imitateResult', { type });
  };

  exports.showImitateWronq = (req, res) => {
    const { type } = req.query;

    res.render('imitate/imitateWrong', { type });
  };

exports.showImitateStart = (req, res) => {
  res.render('imitate/start');
};
  exports.showImitateStart = (req, res) => {
    const type = req.query.type;

    if((type !== 'vowel' && type !== 'consonant')){
      return res.redirect('/imitate');
    }
    res.render('imitate/start', { type });
  };

  exports.redirectBasedOnType = (req, res) => {
    const type = req.query.type;
  
    if (type === 'vowel') {
      return res.redirect('/imitate/vowel');
    } else if (type === 'consonant') {
      return res.redirect('/imitate/consonant');
    } else {
      return res.redirect('/imitate');
    }
  };