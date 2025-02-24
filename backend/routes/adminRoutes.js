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


router.post('/login',loginAdmin);
router.post('/register',registerAdmin);
router.get('/teamCount',adminAuthMiddleware,TeamCount);
router.post('/changeEventStatus',adminAuthMiddleware,ChangeEventStatus);
router.post('/sold',adminAuthMiddleware,sellPOC);
router.post('/biddingPOC',adminAuthMiddleware,updateCurrentAuctionPOC);
router.post('/distributePOC',adminAuthMiddleware,logic);
router.post('/toggle-registration',toggleRegistration);
module.exports = router;