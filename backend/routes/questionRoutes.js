const express = require('express');
const { getQuestions,getPOC, submitQuestions } = require('../controllers/questionController');

const router = express.Router();
console.log("Imported Functions:", { getQuestions, submitQuestions });

router.get('/', getQuestions);
router.post('/submit', submitQuestions);
router.get('/getPOC/:pocName',getPOC);

module.exports = router;