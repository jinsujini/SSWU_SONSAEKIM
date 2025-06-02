  exports.showImitateSelect = (req, res) => {
    res.render('imitate/imitateSelect');
  };
  
  exports.showImitate = (req, res) => {
    res.render('imitate/imitatePage');
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

  exports.redirectBasedOnType = (req, res) => {
    const type = req.query.type;
  
    if (type === 'vowel' || type === 'consonant') {
      return res.render('imitate/imitatePage', {type});
    } else {
      return res.redirect('/imitate');
    }
  };