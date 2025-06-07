const express = require('express');
const router = express.Router();
const imitateController = require('../controllers/imitateController');

// 따라하기 선택 페이지
router.get('/select', imitateController.showImitateSelect);

// 따라하기 페이지
router.get('/:type/study', imitateController.showImitate);

// 모음 결과 확인 페이지
router.get('/:type/result', imitateController.showImitateResult);

// 따라하기 오답 확인 페이지
router.get('/:type/wrong', imitateController.showImitateWrong);

module.exports = router;