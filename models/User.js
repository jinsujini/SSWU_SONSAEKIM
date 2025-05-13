const db = require('../lib/db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  create: (email, name, password, callback) => {
    db.query(
      'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
      [email, name, password],
      callback
    );
  },

  findByEmailAndPassword: (email, password, callback) => {
    db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
      callback
    );
  }
};

module.exports = User;
