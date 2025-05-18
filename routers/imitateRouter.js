const express = require('express');
const router = express.Router();
const imitateController = require('../controllers/imitateController');

// 따라하기 선택 페이지
router.get('/select', imitateController.showImitateSelect);

// 모음 따라하기 페이지
router.get('/vowel', imitateController.showVowel);

// 모음 결과 확인 페이지
router.get('/vowelResult', imitateController.showVowelResult);

// 자음 따라하기 페이지
router.get('/consonant', imitateController.showConsonant);

// 자음 결과 확인 페이지
router.get('/consonantResult', imitateController.showConsonantResult);

// 따라하기 오답 확인 페이지
router.get('/wrong', imitateController.showImitateWronqs);

module.exports = router;