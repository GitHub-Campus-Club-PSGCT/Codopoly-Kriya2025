const express = require('express');


const {getTeamPOC, submitDebugs, getDebugs} = require('../controllers/debugController');
const { protect } = require('../middlewares/authMiddleware');


const router = express.Router();



router.post('/submit', protect, submitDebugs);
router.get('/poc', protect, getTeamPOC);
router.get('/getdebugs', protect, getDebugs);

module.exports = router;