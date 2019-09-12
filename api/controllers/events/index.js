'use strict';

const express = require('express');
const eventsController = require('./events.controller');
const eventController = require('./event.controller');
const router = express.Router();

router.get('/:year/with-attendees', eventsController.getWithAttendees);
router.get('/:year/:headquarterId/:showAll?', eventsController.get);

router.get('/events/:id', eventController.get);
router.post('/events/', eventController.post);
router.put('/events/:id', eventController.update);
router.put('/events/:id/images', eventController.updateImages);
router.put('/events/:id/open', eventController.open);
router.put('/events/:id/pause', eventController.pause);
router.put('/events/:id/close', eventController.close);
router.put('/events/:id/attendees', eventController.addAttendees);
router.delete('/events/:id/:idImage', eventController.deleteImage);
router.delete('/events/:id/delete', eventController.remove);

module.exports = router;
