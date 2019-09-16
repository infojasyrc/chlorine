'use strict';

const express = require('express');
const eventsController = require('./events.controller');
const eventController = require('./event.controller');
const router = express.Router();

router.get('/:year/:headquarterId/:showAll?', eventsController.get);

router.get('/:id', eventController.get);
router.post('/', eventController.post);
router.put('/:id', eventController.update);
router.put('/:id/images', eventController.updateImages);
router.put('/:id/open', eventController.open);
router.put('/:id/pause', eventController.pause);
router.put('/:id/close', eventController.close);
router.put('/:id/attendees', eventController.addAttendees);
router.delete('/:id/:idImage', eventController.deleteImage);
router.delete('/:id/delete', eventController.remove);

module.exports = router;
