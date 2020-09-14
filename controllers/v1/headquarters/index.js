'use strict';

const express = require('express');
const headquartersController = require('./headquarters.controller');
const headquarterController = require('./headquarter.controller');

const router = express.Router();

router.get('/headquarters', headquartersController.get);
router.get('/headquarters/:id', headquarterController.get);

module.exports = router;
