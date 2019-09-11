'use strict';

const express = require('express');
const attendeeController = require('./attendee.controller');
const router = express.Router();

router.get('/', attendeeController.get);
router.post('/', attendeeController.post);
router.put('/update', attendeeController.update);
router.delete('/delete', attendeeController.remove);

module.exports = router;
