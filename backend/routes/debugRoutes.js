const express = require('express');

const {
    getTeamPOC,
    submitDebugs,
} = require('../controllers/debugController');
const { get } = require('mongoose');

const router = express.Router();

router.post('/submit', submitDebugs);
router.get('/:teamid', getTeamPOC);

module.exports = router;