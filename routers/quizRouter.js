const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// 퀴즈 선택 페이지
router.get('/select', quizController.showQuizSelect);

// 퀴즈 문제 풀기 페이지
router.get('/start/:type', quizController.showQuiz);

// 오답 저장
router.post('/result/save', quizController.saveQuizResults);

// 결과 페이지
router.get('/result', quizController.showResult);

// 오답 확인 페이지 또는 오답 모아보기
router.get('/wrong', quizController.showWrongAnswers);

// 북마크 처리
router.post('/bookmark/toggle', quizController.toggleBookmark);

// 퀴즈 없음
router.get('/none', quizController.showQuizNone);

module.exports = router;