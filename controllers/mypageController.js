const { User } = require('../models'); 

exports.renderMypage = async (req, res) => {
  const name = req.session.nickname;

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.redirect('/nouser'); 
    }

    res.render('mypage/mypage', {
      name: user.name,
      is_logined: req.session.is_logined,
      favorite: user.favorite_study,
      email: user.email
    });
  } catch (err) {
    console.error("❌ DB 조회 오류:", err);
    res.status(500).send("서버 오류 발생");
  }
};
