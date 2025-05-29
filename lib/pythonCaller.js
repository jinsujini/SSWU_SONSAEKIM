const { execFile } = require('child_process');
const path = require('path');

exports.runPythonPrediction = (imagePath, callback) => {
  const pyPath = path.join(__dirname, 'python', 'predict.py');

  execFile('python', [pyPath, imagePath], (error, stdout, stderr) => {
    if (error) return callback(error, null);

    const predicted = parseInt(stdout.trim(), 10);
    callback(null, predicted);
  });
};
