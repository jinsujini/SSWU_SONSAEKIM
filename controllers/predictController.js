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
