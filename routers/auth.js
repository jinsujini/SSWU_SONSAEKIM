const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/verify', authController.showVerifyPage);
router.get('/register', authController.showRegisterPage);
router.post('/register-temp', authController.registerTemp);
router.get('/check-email', authController.checkEmail);
router.post('/verify', authController.verifyCode);
router.get('/welcome', authController.showWelcomePage);
router.get('/login', authController.showLoginPage);
router.post('/login_process', authController.loginProcess);
router.get('/findpw', authController.showfinPwPage);
router.get('/findpwverify', authController.showfinPwVerifyPage);
router.get('/changepw', authController.showchangePwPage);
router.post('/findpw', authController.findPwProcess);
router.post('/findpwverify', authController.verifyFindPwCode);
router.post('/changepw', authController.changePassword);

module.exports = router;