const db = require('../../lib/db.js');

exports.getRandomQuizzes = async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM quiz ORDER BY RAND() LIMIT 10', (err, results) => {
        if (err) return reject(err);
        resolve(results); 
    });
    });
};