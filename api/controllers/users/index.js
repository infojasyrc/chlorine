'use strict';

const express = require('express');
const usersController = require('./users.controller');
const userController = require('./user.controller');

const router = express.Router();

router.get('/', usersController.get);
router.get('/users/:id', userController.get);
router.post('/users/', userController.post);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.remove);
router.post('/users/:id/change-password', userController.changePassword);
router.post('/users/by-uid', userController.getByUid);

module.exports = router;
