'use strict';

const BaseController = require('../base.controller');
const serviceContainer = require('./../../../services/service.container');

const baseController = new BaseController();
const sessionService = serviceContainer('session');
const userService = serviceContainer('users');

let responseCode;
let responseData;

const get = async (request, response) => {
  // Access forbidden
  if (!baseController.isTokenInHeader(request)) {
    return response.status(403).json(baseController.getErrorResponse('No session information'));
  }

  try {
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization);
    console.log(sessionInfo);
    responseCode = sessionInfo.responseCode;
    responseData = baseController.getSuccessResponse(sessionInfo.data, sessionInfo.message);

  } catch (err) {
    const errorMessage = 'Error getting user profile';
    console.error(errorMessage, err);
    responseCode = 500;
    responseData = baseController.getErrorResponse(errorMessage);
  }

  return response.status(responseCode).json(responseData);
};

module.exports = {
  get
};