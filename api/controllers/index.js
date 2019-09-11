'use strict';

const express = require('express');
const router = express.Router();

router.use('/healthcheck', require('./healthcheck'));
router.use('/attendees', require('./attendees'));
router.use('/attendee', require('./attendee'));
router.use('/users', require('./users'));
router.use('/user', require('./user'));
router.use('/authenticate/', require('./authentication'));
router.use('/roles/', require('./roles'));
router.use('/role/', require('./role'));
router.use('/headquarters/', require('./headquarters'));
router.use('/headquarter/', require('./headquarter'));
router.use('/events/', require('./events'));
router.use('/event/', require('./event'));
router.use('/image/', require('./image'));

module.exports = router;
