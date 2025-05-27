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

  exports.showConsonantResult = (req, res) => {
    res.render('imitate/consonantResult');
  };

  exports.showImitateWronqs = (req, res) => {
    res.render('imitate/imitateWrong');
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