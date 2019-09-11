'use strict';

const express = require('express');
const attendeesController = require('./attendees.controller');
const router = express.Router();

router.get('/:id', attendeesController.get);

module.exports = router;
