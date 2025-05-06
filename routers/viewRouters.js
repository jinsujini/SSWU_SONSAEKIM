const express = require('express');
const router = express.Router();

router.get('/mypage', (req, res) => {
    res.render('mypage'); 
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

module.exports = router;
