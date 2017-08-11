const express = require('express');
const router = express.Router();
const Employer = require('./../controller/employer');

router.get('/task/:id/', Employer.getTask);
router.post('/mark_absent/', Employer.markAbsent);
module.exports = router;