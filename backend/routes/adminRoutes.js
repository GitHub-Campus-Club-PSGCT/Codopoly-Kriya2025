const express = require('express');
const {logic} = require('../controllers/qn_distribution_logic')
const {
    TeamCount,
    registerAdmin,
    loginAdmin,
    ChangeEventStatus,
    sellPOC,
    updateCurrentAuctionPOC,
    toggleRegistration
} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

const router = express.Router();


router.post('/login',loginAdmin); //for logging in admin
//router.post('/register',registerAdmin); //no need to use it frontend
router.get('/teamCount',adminAuthMiddleware,TeamCount); //returning the team count
router.post('/changeEventStatus',adminAuthMiddleware,ChangeEventStatus); //changing the event status
router.post('/sold',adminAuthMiddleware,sellPOC); //confirm the bid and selling the POC to team
router.post('/biddingPOC',adminAuthMiddleware,updateCurrentAuctionPOC);
router.post('/distributePOC',adminAuthMiddleware,logic);
router.post('/toggle-registration',adminAuthMiddleware,toggleRegistration);
module.exports = router;