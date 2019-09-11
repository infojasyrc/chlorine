'use strict';

const express = require('express');
const eventsController = require('./events.controller');
const router = express.Router();

router.get('/:year/with-attendees', eventsController.getWithAttendees);
router.get('/:year/:headquarterId/:showAll?', eventsController.get);

module.exports = router;
