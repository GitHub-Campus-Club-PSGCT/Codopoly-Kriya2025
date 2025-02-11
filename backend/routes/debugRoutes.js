const express = require('express');

const {
    getTeamPOC,
    submitDebugs,
} = require('../controllers/debugController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/submit', authMiddleware, submitDebugs);
router.get('/poc', authMiddleware, getTeamPOC);

module.exports = router;