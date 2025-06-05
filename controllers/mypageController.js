const mypageService = require('../services/mypageService');

exports.renderMypage = mypageService.renderMypage;
exports.updateProfile = mypageService.updateProfile;
exports.goMypage = mypageService.goMypage;
exports.renderNoUser = (req, res) => res.render('auth/home');
exports.sendEmailCode = mypageService.sendEmailCode;
exports.verifyEmailCode = mypageService.verifyEmailCode;
exports.updateEmail = mypageService.updateEmail;
exports.logout = mypageService.logout;
