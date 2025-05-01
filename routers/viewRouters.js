const express = require('express');
const router = express.Router();

router.get('/mypage', (req, res) => {
    res.render('mypage'); 
});

module.exports = router;
