const express = require('express');
const router = express.Router();

router.get('/mypage', (req, res) => {
    res.render('mypage'); 
});

router.get('/learn', (req, res) => {
    res.render('quiz/learn', { userName: '손새김'}); 
});

router.get('/study/imitate', (req, res) => {
    res.render('imitate'); 
});

router.get('/study/imitate/vowel', (req, res) => {
    res.render('vowel'); 
});

router.get('/study/imitate/consonant', (req, res) => {
    res.render('consonant'); 
});

router.get('/study/imitate/vowel/result', (req, res) => {
    res.render('vowelResult'); 
});

router.get('/study/imitate/consonant/result', (req, res) => {
    res.render('consonantResult'); 
});

router.get('/study/imitate/vowel/wrong', (req, res) => {
    res.render('quiz/imitateWrong'); 
});

router.get('/game', (req, res) => {
    res.render('game/start');
});

router.get('/game/play', (req, res) => {
    res.render('game/play');
});
module.exports = router;
