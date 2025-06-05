const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { isLoggedIn } = require('../middlewares/logincheck');

router.get('/start', gameController.gameStart);

router.get('/play', isLoggedIn, gameController.gamePlay);

router.post('/record', isLoggedIn, gameController.createGameRecord);

router.get('/top3', isLoggedIn, gameController.getTop3);

router.get('/my-best-score', isLoggedIn, gameController.getMyBestScore);

router.get('/random-signs', gameController.getImages);

module.exports = router;