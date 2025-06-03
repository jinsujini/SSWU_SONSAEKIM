const {SignVc, VcWrong} = require('../models');
const { Op } = require('sequelize');

exports.showImitateSelect = (req, res) => {
    res.render('imitate/imitateSelect');
  };
  
exports.showImitate =  async (req, res) => {
    try {
      const type = req.query.type;

      const imitateList = await SignVc.findAll({
        where: type === 'vowel' 
          ? { vc_id: { [Op.lte]: 10 } }
          : { vc_id: { [Op.gt]: 10 } },
        order: SignVc.sequelize.random(),         
        limit: 2 //학습 개수 결정
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
    const { type } = req.query;
    const userId = req.session.user?.user_id;

    if (!userId) return res.redirect('/login');

    res.render('imitate/imitateWrong', { type });
  };

  exports.showImitateStart = (req, res) => {
    const type = req.query.type;

    if((type !== 'vowel' && type !== 'consonant')){
      return res.redirect('/imitate');
    }
    res.render('imitate/start', { type });
  };
