const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/start', gameController.gameStart);

router.get('/play', gameController.gamePlay);

module.exports = router;