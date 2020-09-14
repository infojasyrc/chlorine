'use strict';

const express = require('express');
const authenticationController = require('./authentication.controller');
const router = express.Router();

router.post('/revoke-token', authenticationController.revokeToken);
router.post('/reset-password', authenticationController.resetPassword);
router.post('/create', authenticationController.create);

module.exports = router;
