'use strict';

const express = require('express');
const headquarterController = require('./headquarter.controller');

const router = express.Router();

router.get('/:id', headquarterController.get);

module.exports = router;
