const express = require('express');

const {
    getAllPOCs,
    insertCorrectQuestions,
    insertErrorQuestions
} = require('../controllers/bankController');

const router = express.Router();

router.get('/', getAllPOCs);
router.post('/insertCorrect',insertCorrectQuestions);
router.post('/insertError',insertErrorQuestions);
module.exports = router;