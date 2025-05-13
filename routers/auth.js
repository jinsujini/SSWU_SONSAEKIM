require('dotenv').config();
const express = require('express');
const router = express.Router();
const redisClient = require('../configs/redis');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');
const User = require('../models/User'); 

router.get('/verify', (req, res) => {
  const { email } = req.query;
  res.render('verify', { email });
});

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

  User.findByEmail(email, async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.send("이미 존재하는 이메일입니다.");
    }

    const code = generateRandomNumber();
    const tempUserData = JSON.stringify({ name, email, password });

    await redisClient.set(`${email}:authCode`, code, { EX: 180 });
    await redisClient.set(`${email}:tempUser`, tempUserData, { EX: 180 });

    await sendEmail(email, code);
    res.redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
  });
});

router.post('/verify', async (req, res) => {
  const { email, code: userCode } = req.body;

  const savedCode = await redisClient.get(`${email}:authCode`);
  const tempUserStr = await redisClient.get(`${email}:tempUser`);
  const tempUser = tempUserStr ? JSON.parse(tempUserStr) : null;

  if (!savedCode || !tempUser) {
    return res.send("인증 시간이 만료되었습니다. 다시 시도해주세요.");
  }

  if (userCode === savedCode) {
    const { name, password } = tempUser;
    User.create(email, name, password, (err) => {
      if (err) throw err;
      redisClient.del(`${email}:authCode`);
      redisClient.del(`${email}:tempUser`);
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

  User.findByEmailAndPassword(email, password, (err, results) => {
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
