const express = require('express');
const { getQuestions, submitQuestions } = require('../controllers/questionController');

const router = express.Router();
console.log("Imported Functions:", { getQuestions, submitQuestions });

router.get('/', getQuestions);
router.post('/submit', submitQuestions);

module.exports = router;