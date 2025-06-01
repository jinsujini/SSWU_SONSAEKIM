const { runSingleImagePrediction } = require('../lib/pythonCaller'); 
exports.handlePrediction = (req, res) => {
  const imagePath = req.file.path;
  const correct = req.body.correctText;
  const mode = req.body.mode;

  const VOWELS = ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'];
  const CONSONANTS = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const ALLOW = mode === 'vowel' ? VOWELS : CONSONANTS;

  runSingleImagePrediction(imagePath, (err, result) => {
    if (err) {
      console.error('예측 오류:', err);
      return res.status(500).json({ error: '예측 실패' });
    }

    const { predicted, confidence } = result;
    const isValid = ALLOW.includes(predicted);
    const isCorrect = predicted === correct;

    res.json({ predicted, confidence, isValid, isCorrect });
  });
};
