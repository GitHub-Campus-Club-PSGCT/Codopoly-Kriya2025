const express = require('express');
const { getQuestions,getPOC, submitQuestions } = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getQuestions);
router.post('/submit', submitQuestions);
router.get('/getPOC/:pocName',getPOC);
router.get('/poc', protect, getTeamPOC);
module.exports = router;