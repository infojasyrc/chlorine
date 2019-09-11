'use strict';

const express = require('express');
const roleController = require('./role.controller');

const router = express.Router();

router.get('/:id', roleController.get);

module.exports = router;
