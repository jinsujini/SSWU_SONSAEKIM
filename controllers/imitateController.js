const {SignVc, VcWrong} = require('../models');
const { Op } = require('sequelize');

exports.showImitateSelect = (req, res) => {
    res.render('imitate/imitateSelect');
  };
  
exports.showImitate =  async (req, res) => {
    try {
      const type = req.params.type; // vowel 또는 consonant
      

      const imitateList = await SignVc.findAll({
        where: type === 'vowel' 
          ? { vc_id: { [Op.gt]: 10 } }
          : { vc_id: { [Op.lte]: 10 } },
        order: SignVc.sequelize.random(),         
        limit: 10 //학습 개수 결정
      });

      const enrichedImitateList = imitateList.map(item => ({
        ...item.toJSON(),
        image: item.image || '' ,
        source_type: 'sign_vc',
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

  exports.showImitateResult = (req, res) => {
    const { type, correctCount } = req.params;
    res.render('imitate/imitateResult', { type, correctCount });
  };

  exports.saveImitateResult = async (req, res) => {
    const userId = req.session.user?.user_id;
    const { imitateResults } = req.body;
  
    if (!userId) return res.status(401).json({ message: '로그인이 필요합니다.' });
  
    try {
      for (const item of imitateResults) {
        const common = {
          is_follow: result.is_follow ?? true,
          is_relearned: result.is_relearned ?? null,
          selected: null,
          option1: null,
          option2: null,
          option3: null,
          option4: null,
          answer: result.answer,
          created_at: new Date()
        };
        if (result.source_type === 'vowel' || result.source_type === 'consonant') {
          const where = { user_id: userId, word_id: result.source_id };
          const existing = await WordWrong.findOne({ where });
        
          if (existing) {
            await WordWrong.update(common, { where });
            } else {
            await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common })
            }
        } 
        
      }
  
      res.json({ message: '결과 저장 완료' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '결과 저장 실패' });
    }
  };

  exports.showImitateWrong = (req, res) => {
    const { type } = req.params;
    res.render('imitate/imitateWrong', { type });
  };

  exports.showImitateStart = (req, res) => {
    const type = req.query.type;

    if((type !== 'vowel' && type !== 'consonant')){
      return res.redirect('/imitate');
    }
    res.render('imitate/start', { type });
  };
