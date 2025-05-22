const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/start', gameController.gameStart);

router.get('/play', gameController.gamePlay);

router.post('/record', gameController.createGameRecord);

router.get('/top3', gameController.getTop3);

router.get('/my-best-score', gameController.getMyBestScore);

module.exports = router;