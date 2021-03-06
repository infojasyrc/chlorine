'use strict';

const express = require('express');
const transactionsController = require('./transactions.controller');

const router = express.Router();

router.post('/submit-payment', transactionsController.submitTransaction);
router.post('/reset', transactionsController.resetTransactionsPerUser);

module.exports = router;
