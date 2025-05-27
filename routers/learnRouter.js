const express = require('express');
const router = express.Router();
const learnController = require('../controllers/learnController');

router.get('/select', learnController.showLearnSelect);

module.exports = router;