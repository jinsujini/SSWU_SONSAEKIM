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
    const type = req.query.type;

    if((type !== 'vowel' && type !== 'consonant')){
      return res.redirect('/imitate');
    }
    res.render('imitate/start', { type });
  };
