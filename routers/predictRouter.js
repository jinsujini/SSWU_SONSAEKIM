const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const predictController = require('../controllers/predictController');

const upload = multer({ dest: 'public/uploads/' });

router.post('/predict', upload.single('image'), predictController.handlePrediction);

module.exports = router;
