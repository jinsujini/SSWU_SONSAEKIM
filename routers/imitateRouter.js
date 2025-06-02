const express = require('express');
const router = express.Router();
const imitateController = require('../controllers/imitateController');

// 따라하기 선택 페이지
router.get('/select', imitateController.showImitateSelect);

// 따라하기 페이지
router.get('/start/:type', imitateController.showImitate);

// 모음 결과 확인 페이지
router.get('/result', imitateController.showImitateResult);

// 따라하기 오답 확인 페이지
router.get('/wrong', imitateController.showImitateWronq);

router.get('/start', imitateController.showImitateStart);

router.get('/redirect', imitateController.redirectBasedOnType);

module.exports = router;