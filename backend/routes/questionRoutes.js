const express = require('express');
const { getQuestions,getPOC, submitQuestions } = require('../controllers/questionController');

const router = express.Router();

router.get('/', getQuestions);
router.post('/submit', submitQuestions);
router.get('/getPOC/:pocName',getPOC);

module.exports = router;