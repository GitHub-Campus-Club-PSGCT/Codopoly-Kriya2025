const express = require('express');

const {
    TeamCount,
    registerAdmin,
    loginAdmin,
    ChangeEventStatus,
    sellPOC,
    updateCurrentAuctionPOC
} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

const router = express.Router();


router.post('/login',loginAdmin);
router.post('/register',registerAdmin);
router.get('/teamCount',adminAuthMiddleware,TeamCount);
router.post('/changeEventStatus',adminAuthMiddleware,ChangeEventStatus);
router.post('/sold',adminAuthMiddleware,sellPOC);
router.post('/biddingPOC',adminAuthMiddleware,updateCurrentAuctionPOC);

module.exports = router;