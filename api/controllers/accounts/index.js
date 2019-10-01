'use strict';

const express = require('express');

const router = express.Router();

router.get('/check-balance', eventsController.get);
