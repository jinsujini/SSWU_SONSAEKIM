
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

exports.showConsonantResult = (req, res) => {
  res.render('imitate/consonantResult');
};

exports.showImitateWronqs = (req, res) => {
  res.render('imitate/imitateWrong');
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
