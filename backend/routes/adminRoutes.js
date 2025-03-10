const express = require('express');
const {logic} = require('../controllers/qn_distribution_logic');
const {
    TeamCount,
    registerAdmin,
    loginAdmin,
    ChangeEventStatus,
    sellPOC,
    updateCurrentAuctionPOC,
    toggleRegistration,
    bidHistory,
    teamStats,
    getTeamsWithPOCs,
    deletePOCs,
    getTeamWithPoints,
    addTeamPoints,
    getEventStatus,
    saveDistributedPOC,
    deleteQnDistribution,
    getPOCsToBeSold,
    markPOCSold,
    fetchDistributionData,
    makeCanBuyPocTrue

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
router.get('/bidHistory',adminAuthMiddleware,bidHistory);
router.get('/teamStats',adminAuthMiddleware,teamStats);
router.get('/getTeamsWithPOCs',adminAuthMiddleware,getTeamsWithPOCs); //get all teams with their POCs
router.post('/deletePOCs',adminAuthMiddleware,deletePOCs); //delete POC from all teams
router.get('/getTeamWithPoints',adminAuthMiddleware,getTeamWithPoints); //get all teams with their points
router.post('/addTeamPoints',adminAuthMiddleware,addTeamPoints); //add points to teams
router.get('/eventStatus', adminAuthMiddleware, getEventStatus); // Get event status

router.post('/saveDistributedPOC',adminAuthMiddleware,saveDistributedPOC);
router.get('/deleteQnDistribution',adminAuthMiddleware,deleteQnDistribution)
router.get('/fetchQnData',adminAuthMiddleware,fetchDistributionData);
router.get('/makeBuyPOCtrue',adminAuthMiddleware,makeCanBuyPocTrue);

router.post('/markPOCSold', adminAuthMiddleware, markPOCSold); // Mark POC as sold
router.get('/POCsToBeSold', adminAuthMiddleware, getPOCsToBeSold); // Get POCs to be sold

module.exports = router;