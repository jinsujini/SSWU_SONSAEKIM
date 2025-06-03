require('dotenv').config();
const redisClient = require('../configs/redis');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');
const { User, Attendance } = require('../models');
const bcrypt = require('bcrypt');

//회원가입, 로그인 관련
exports.showVerifyPage = (req, res) => {
  const { email } = req.query;
  res.render('auth/verify', { email });
};

exports.showRegisterPage = (req, res) => {
  res.render('auth/register', {
    name: '',
    email: '',
    emailError: '',
    passwordMatchError: '',
    passwordMatched: false,
  });
};

exports.registerTemp = async (req, res) => {
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
};

exports.checkEmail = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email } });
  res.json({ exists: !!user });
};

exports.verifyCode = async (req, res) => {
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
};

exports.showWelcomePage = (req, res) => {
  res.render('auth/welcome');
};

exports.showLoginPage = (req, res) => {
  res.render('auth/login', { email: '', error: null });
};

exports.loginProcess = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', { error: '이메일 또는 비밀번호가 올바르지 않습니다.', email });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      };
    
      const today = new Date().toISOString().slice(0, 10); 
      const alreadyExists = await Attendance.findOne({
        where: {
          user_id: user.user_id,
          date: today
        }
      });
    
      if (!alreadyExists) {
        await Attendance.create({
          user_id: user.user_id,
          date: today
        });
      }
    //로그인 성공시, 새로운 home으로 경로 닮
      return res.redirect('/home');
    }    
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
};

//비밀번호 찾기 관련
exports.showfinPwPage = (req, res) => {
  res.render('auth/findpw', { email: '', error: '' });
};

exports.showfinPwVerifyPage = (req, res) => {
  const { email } = req.query;
  res.render('auth/findpwverify', { email });
};

exports.showchangePwPage = (req, res) => {
  const { email } = req.query;
  res.render('auth/changepw', { email });
};

exports.findPwProcess = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/findpw', {
        email,
        error: '존재하지 않는 이메일입니다.'
      });
    }

    const authCode = generateRandomNumber();
    await redisClient.setEx(`${email}:resetCode`, 300, authCode);
    await sendEmail(email, authCode);

    res.redirect(`/auth/findpwverify?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류 발생');
  }
};

exports.verifyFindPwCode = async (req, res) => {
  const { email, code: userCode } = req.body;

  try {
    const savedCode = await redisClient.get(`${email}:resetCode`);

    if (!savedCode) {
      return res.render('auth/findpwverify', {
        email,
        errorMessage: '인증 시간이 만료되었습니다. 다시 시도해주세요.',
      });
    }

    if (userCode === savedCode) {
      await redisClient.del(`${email}:resetCode`);
      return res.redirect(`/auth/changepw?email=${encodeURIComponent(email)}`);
    } else {
      return res.render('auth/findpwverify', {
        email,
        code: userCode,
        errorMessage: '인증번호가 일치하지 않습니다.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류 발생");
  }
};

exports.changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.render('auth/changepw', {
      errorMessage: '비밀번호가 일치하지 않습니다.'
    });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).send('이메일 정보가 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    return res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('비밀번호 변경 중 오류 발생');
  }
};
