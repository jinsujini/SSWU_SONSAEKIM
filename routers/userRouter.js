const mypageController = require('../controllers/mypageController');
const { User } = require('../models');

router.get('/mypage', mypageController.renderMypage);

router.post('/updateProfile', async (req, res) => {
  const nickname = req.session.nickname; 
  const { name } = req.body;              

  try {
    const user = await User.findOne({ where: { name: nickname } });

    if (!user) return res.status(404).json({ success: false });

    user.name = name;
    await user.save();

    req.session.nickname = name; 

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ 이름 업데이트 실패:", err);
    return res.status(500).json({ success: false });
  }
});



router.get('/nouser', (req, res) => {
    res.render('mypage/nouser');
});