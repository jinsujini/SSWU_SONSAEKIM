const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');

router.get('/register', (req, res) => {
  res.render('register'); 
});

router.post('/register-temp', async (req, res) => {
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    return res.send("모든 값을 입력하세요");
  }

  if (password !== password2) {
    return res.send("비밀번호가 일치하지 않습니다.");
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.send("이미 존재하는 이메일입니다.");
    }

    const code = generateRandomNumber();
    req.session.tempUser = { name, email, password };
    req.session.emailAuthCode = code;

    await sendEmail(email, code);
    res.redirect('/auth/verify');
  });
});

router.get('/verify', (req, res) => {
  res.render('verify');
});

router.post('/verify', (req, res) => {
  const userCode = req.body.code;
  const savedCode = req.session.emailAuthCode;
  const { name, email, password } = req.session.tempUser;

  if (userCode === savedCode) {
    db.query('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, password], (err) => {
      if (err) throw err;
      req.session.emailAuthCode = null;
      req.session.tempUser = null;
      res.redirect('/auth/welcome');
    });
  } else {
    res.send("인증 코드가 일치하지 않습니다.");
  }
});

router.get('/welcome', (req, res) => {
  res.render('welcome'); 
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login_process', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.is_logined = true;
      req.session.nickname = results[0].name;
      res.send(`${results[0].name} 로그인 성공`);
    } else {
      res.send("로그인 실패");
    }
  });
});

module.exports = router;