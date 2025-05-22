require('dotenv').config();
const express = require('express');
const router = express.Router();
const redisClient = require('../configs/redis');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');
const { User } = require('../models'); 
const bcrypt = require('bcrypt');

router.get('/verify', (req, res) => {
  const { email } = req.query;
  res.render('auth/verify', { email });
});

router.get('/register', (req, res) => {
  res.render('auth/register', {
    name: '',
    email: '',
    emailError: '',
    passwordMatchError: '',
    passwordMatched: false,
  });
});

router.post('/register-temp', async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let emailError = '';
  let passwordMatchError = '';
  let passwordMatched = false;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    emailError = '이미 존재하는 이메일입니다.';
  }

  if (password !== password2) {
    passwordMatchError = '비밀번호가 일치하지 않습니다.';
  } else {
    passwordMatched = true;
  }

  if (emailError || passwordMatchError) {
    return res.render('auth/register', {
      name,
      email,
      emailError,
      passwordMatchError,
      passwordMatched,
    });
  }

  const authCode = generateRandomNumber();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await redisClient.setEx(`${email}:authCode`, 300, authCode);
    await redisClient.setEx(`${email}:tempUser`, 300, JSON.stringify({ name, password: hashedPassword }));

    await sendEmail(email, authCode);

    res.redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error(err);
    return res.render('auth/register', {
      name,
      email,
      emailError: '오류가 발생했습니다. 다시 시도해주세요.',
      passwordMatchError,
      passwordMatched,
    });
  }
});

router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email } });
  res.json({ exists: !!user });
});

router.post('/verify', async (req, res) => {
  const { email, code: userCode } = req.body;

  try {
    const savedCode = await redisClient.get(`${email}:authCode`);
    const tempUserStr = await redisClient.get(`${email}:tempUser`);
    const tempUser = tempUserStr ? JSON.parse(tempUserStr) : null;

    if (!savedCode || !tempUser) {
      return res.render('auth/verify', {
        email,
        errorMessage: '인증 시간이 만료되었습니다. 다시 시도해주세요.',
      });
    }

    if (userCode === savedCode) {
      const { name, password } = tempUser;

      await User.create({ email, name, password });

      await redisClient.del(`${email}:authCode`);
      await redisClient.del(`${email}:tempUser`);
      return res.redirect('/auth/welcome');
    } else {
      return res.render('auth/verify', {
        email,
        code: userCode,
        errorMessage: '인증번호가 일치하지 않습니다.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
});


router.get('/welcome', (req, res) => {
  res.render('auth/welcome');
});

router.get('/login', (req, res) => {
  res.render('auth/login', { email: '', error: null });
});

router.post('/login_process', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', { error: '이메일 또는 비밀번호가 올바르지 않습니다.', email }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.is_logined = true;
      req.session.nickname = user.name;
      res.send(`${user.name} 로그인 성공`);
    } else {
      return res.render('auth/login', { error: '이메일 또는 비밀번호가 올바르지 않습니다.', email });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
});

module.exports = router;
