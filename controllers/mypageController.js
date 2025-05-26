const { User } = require('../models');

// 마이페이지 렌더링
exports.renderMypage = async (req, res) => {
  const userId = req.session.user?.user_id;

  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) return res.redirect('/nouser');

    res.render('mypage/mypage', {
      name: user.name,
      is_logined: req.session.is_logined,
      favorite: user.favorite_study,
      email: user.email
    });
  } catch (err) {
    console.error("DB 조회 오류:", err);
    res.status(500).send("서버 오류 발생");
  }
};

// 프로필 수정
exports.updateProfile = async (req, res) => {
  const userId = req.session.user?.user_id;
  const { name } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) return res.status(404).json({ success: false });

    user.name = name;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("이름 업데이트 실패:", err);
    return res.status(500).json({ success: false });
  }
};

// /gomypage 리다이렉트
exports.goMypage = async (req, res) => {
  const userId = req.session.user?.user_id;
  console.log(req.session);

  if (!userId) {
    return res.redirect('/nouser');
  }

  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (user) {
      return res.redirect('/mypage');
    } else {
      return res.redirect('/nouser');
    }
  } catch (err) {
    console.error("gomypage 리다이렉션 오류:", err);
    return res.status(500).send("서버 오류 발생");
  }
};

// nouser 페이지 렌더링
exports.renderNoUser = (req, res) => {
  res.render('mypage/nouser');
};

const { generateRandomNumber, sendEmail } = require('../lib/email.helper');

// 인증번호 전송
exports.sendEmailCode = async (req, res) => {
  const { email } = req.body;
  const code = generateRandomNumber(6);

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.error("이미 사용중인 이메일입니다.");
      return res.status(400).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }

    await sendEmail(email, code);
    req.session.emailCode = code;
    req.session.verifiedEmail = email;
    req.session.save(() => {
      return res.json({ success: true });
    });
  } catch (err) {
    console.error("이메일 전송 실패:", err);
    return res.status(500).json({ success: false });
  }
};

// 인증번호 확인
exports.verifyEmailCode = (req, res) => {
  const { code, email } = req.body;

  const savedCode = req.session.emailCode;
  const savedEmail = req.session.verifiedEmail;

  if (savedCode && savedCode === code && savedEmail === email) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
};


exports.updateEmail = async (req, res) => {
  const userId = req.session.user?.user_id;
  const newEmail = req.body.newEmail;

  if (!userId || !newEmail) {
    return res.status(400).send("유저아이디/이메일 누락");
  }

  if (
    !req.session.emailCode ||
    !req.session.verifiedEmail ||
    req.session.verifiedEmail !== newEmail
  ) {
    return res.status(403).send("이메일 인증을 완료해주세요.");
  }

  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }

    user.email = newEmail;
    await user.save();

    req.session.user.email = newEmail;
    delete req.session.emailCode;
    delete req.session.verifiedEmail;

    req.session.save(() => {
      res.redirect('/mypage');
    });
  } catch (err) {
    console.error("이메일 변경 실패:", err);
    res.status(500).send("서버 오류 발생");
  }
};
