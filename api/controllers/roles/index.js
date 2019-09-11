'use strict';

const express = require('express');
const rolesController = require('./roles.controller');

const router = express.Router();

router.get('/', rolesController.get);

module.exports = router;
