const express = require('express');
const router = express.Router();

router.get('/mypage', (req, res) => {
    res.render('mypage'); 
});

router.get('/game', (req, res) => {
    res.render('game/start');
});

module.exports = router;
