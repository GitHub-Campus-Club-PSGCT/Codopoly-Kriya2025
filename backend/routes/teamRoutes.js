const express = require('express');

const {
    registerTeam, loginTeam, getTeamDetails,
    clearAllTeamPOCs
} = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const {checkRegistrationStatus} = require('../middlewares/checkRegistrationStatus');
const router = express.Router();

router.get('/details', protect,getTeamDetails);
router.post('/register',checkRegistrationStatus,registerTeam);
router.post('/login',loginTeam);
router.get('/deletePOC',clearAllTeamPOCs);
module.exports = router;