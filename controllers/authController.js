require('dotenv').config();
const authService = require('../services/authService');

exports.showVerifyPage = authService.showVerifyPage;
exports.showRegisterPage = authService.showRegisterPage;
exports.registerTemp = authService.registerTemp;
exports.checkEmail = authService.checkEmail;
exports.verifyCode = authService.verifyCode;
exports.showWelcomePage = authService.showWelcomePage;
exports.showLoginPage = authService.showLoginPage;
exports.loginProcess = authService.loginProcess;

exports.showfinPwPage = authService.showfinPwPage;
exports.showfinPwVerifyPage = authService.showfinPwVerifyPage;
exports.showchangePwPage = authService.showchangePwPage;
exports.findPwProcess = authService.findPwProcess;
exports.verifyFindPwCode = authService.verifyFindPwCode;
exports.changePassword = authService.changePassword;
