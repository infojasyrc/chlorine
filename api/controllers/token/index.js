'use strict';

const express = require('express');
const tokenController = require('./token.controller');

const router = express.Router();

router.post('/access-token', tokenController.accessToken);

module.exports = router;
