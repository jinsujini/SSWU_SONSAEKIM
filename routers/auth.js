require('dotenv').config();
const express = require('express');
const router = express.Router();
const redisClient = require('../configs/redis');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');
const { User } = require('../models'); //이거 바꿨다 언니 - 수빈 -
const bcrypt = require('bcrypt');

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

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.send("이미 존재하는 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = generateRandomNumber();
    const tempUserData = JSON.stringify({ name, email, password: hashedPassword });

    await redisClient.set(`${email}:authCode`, code, { EX: 180 });
    await redisClient.set(`${email}:tempUser`, tempUserData, { EX: 180 });

    await sendEmail(email, code);
    res.redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
});
router.post('/verify', async (req, res) => {
  const { email, code: userCode } = req.body;

  try {
    const savedCode = await redisClient.get(`${email}:authCode`);
    const tempUserStr = await redisClient.get(`${email}:tempUser`);
    const tempUser = tempUserStr ? JSON.parse(tempUserStr) : null;

    if (!savedCode || !tempUser) {
      return res.send("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    }

    if (userCode === savedCode) {
      const { name, password } = tempUser;

      await User.create({ email, name, password });

      await redisClient.del(`${email}:authCode`);
      await redisClient.del(`${email}:tempUser`);
      res.redirect('/auth/welcome');
    } else {
      res.send("인증 코드가 일치하지 않습니다.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
});

router.get('/welcome', (req, res) => {
  res.render('welcome');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login_process', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.send("로그인 실패: 유저 없음");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      };
      res.send(`${user.name} 로그인 성공`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
});

module.exports = router;
