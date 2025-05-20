const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('auth/home');
  });

router.get('/gomypage', (req, res) => {
     if (req.session.user) {
        return res.redirect('/mypage');
    } else {
        return res.redirect('/nouser');
    }
});
router.get('/mypage', (req, res) => {
    res.render('mypage/mypage'); 
});

router.get('/nouser', (req, res) => {
    res.render('mypage/nouser'); 
});


router.get('/learn', (req, res) => {
    res.render('learn/learn', { userName: '손새김'}); 
});

router.get('/study/imitate', (req, res) => {
    res.render('imitate/imitate'); 
});

router.get('/study/imitate/vowel', (req, res) => {
    res.render('imitate/vowel'); 
});

router.get('/study/imitate/consonant', (req, res) => {
    res.render('imitate/consonant'); 
});

router.get('/study/imitate/vowel/result', (req, res) => {
    res.render('imitate/vowelResult'); 
});

router.get('/study/imitate/consonant/result', (req, res) => {
    res.render('imitate/consonantResult'); 
});

router.get('/study/imitate/vowel/wrong', (req, res) => {
    res.render('imitate/imitateWrong'); 
});

router.get('/game', (req, res) => {
    res.render('game/start');
});

router.get('/game/play', (req, res) => {
    res.render('game/play');
});
module.exports = router;
