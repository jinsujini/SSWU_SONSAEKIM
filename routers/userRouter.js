const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypageController');

router.get('/mypage', mypageController.renderMypage);
router.get('/gomypage', mypageController.goMypage);
router.get('/nouser', mypageController.renderNoUser);
router.post('/updateProfile', mypageController.updateProfile);



module.exports = router;