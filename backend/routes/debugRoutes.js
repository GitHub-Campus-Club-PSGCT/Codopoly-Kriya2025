const express = require('express');


const {getTeamPOC,submitDebugs} = require('../controllers/debugController');
const {authMiddleware} = require('../middlewares/authMiddleware');


const router = express.Router();
console.log("Imported Functions:", { getTeamPOC, submitDebugs });


router.post('/submit', submitDebugs);
router.get('/poc', getTeamPOC);

module.exports = router;