const express = require('express');

const {
    registerTeam, loginTeam, getTeamDetails
} = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/details', protect,getTeamDetails);
router.post('/register',registerTeam);
router.post('/login',loginTeam);
module.exports = router;