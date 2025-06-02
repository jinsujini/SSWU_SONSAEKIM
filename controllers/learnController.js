exports.showLearnSelect = (req, res) => {
    res.render('learn/learn', { userName: '손새김'});
  };

// exports.showLearnSelect = async (req, res) => {
//   const userId = req.session.user?.user_id;
//   if (!userId) return res.redirect('/nouser');

//   const userName = users.name;

//   res.render('learn/learn', { userName });
// };