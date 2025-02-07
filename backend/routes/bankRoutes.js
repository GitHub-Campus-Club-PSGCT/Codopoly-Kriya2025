const express = require('express');

const {
    getAllPOCs,
} = require('../controllers/bankController');

const router = express.Router();

router.get('/', getAllPOCs);

module.exports = router;