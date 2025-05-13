const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// 퀴즈 선택 페이지
router.get('/select', quizController.showQuizSelect);

// 퀴즈 문제 풀기 페이지
router.get('/start', quizController.showQuiz);

// 결과 페이지
router.get('/result', quizController.showResult);

// 오답 확인 페이지
router.get('/wrong', quizController.showWrongAnswers);

module.exports = router;