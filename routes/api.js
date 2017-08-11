/**
 * This file is called from index.js file to specify all routes of form (/api/*)
 * */

const express = require('express');
const router = express.Router();
const employer = require('./employer');
router.use('/employer/', employer);
module.exports = router;
