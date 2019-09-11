'use strict';

const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.get('/:id', userController.get);
router.post('/', userController.post);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);
router.post('/:id/change-password', userController.changePassword);
router.post('/by-uid', userController.getByUid);

module.exports = router;
