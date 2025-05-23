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
    console.error("❌ 이름 업데이트 실패:", err);
    return res.status(500).json({ success: false });
  }
};

// /gomypage 리다이렉트 처리
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
