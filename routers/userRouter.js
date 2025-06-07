const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypageController');

router.get('/mypage', mypageController.renderMypage);
router.get('/gomypage', mypageController.goMypage);
router.get('/nouser', mypageController.renderNoUser);
router.get('/logout', mypageController.logout);

router.post('/updateProfile', mypageController.updateProfile);
router.post('/sendEmailCode', mypageController.sendEmailCode);
router.post('/verifyEmailCode', mypageController.verifyEmailCode);
router.post('/updateEmail', mypageController.updateEmail)
router.get('/bookmarkDetail/vc/:id', mypageController.renderVcDetail);
router.get('/bookmarkDetail/word/:id', mypageController.renderWordDetail);



module.exports = router;