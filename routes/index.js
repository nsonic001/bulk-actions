/**
 * This file is called from server.js file to specify all routes from the root (/)
 * */

const express = require('express');
const router = express.Router();
const api = require('./api');
router.use('/task_api/', api);

module.exports = router;