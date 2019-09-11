'use strict';

const express = require('express');
const headquartersController = require('./headquarters.controller');

const router = express.Router();

router.get('/', headquartersController.get);

module.exports = router;
