const express = require('express');

<<<<<<< HEAD
const {
    getTeamPOC,
    submitDebugs,
} = require('../controllers/debugController');
const {protect} = require('../middlewares/authMiddleware');
=======
const {getTeamPOC,submitDebugs} = require('../controllers/debugController');
const {authMiddleware} = require('../middlewares/authMiddleware');
>>>>>>> b7db3e638b89bf3ee2270c32ab641267184ec2b4

const router = express.Router();
console.log("Imported Functions:", { getTeamPOC, submitDebugs });

<<<<<<< HEAD
router.post('/submit', protect, submitDebugs);
router.get('/poc', protect, getTeamPOC);
=======

router.post('/submit', submitDebugs);
router.get('/poc', getTeamPOC);
>>>>>>> b7db3e638b89bf3ee2270c32ab641267184ec2b4

module.exports = router;