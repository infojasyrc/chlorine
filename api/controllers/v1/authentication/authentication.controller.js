'use strict';

const setupBaseController = require('../base.controller');
const serviceContainer = require('../../../../services/service.container');

let baseController = new setupBaseController();
const authenticationService = serviceContainer('authentication');

let responseCode;
let responseData;

const revokeToken = async (request, response) => {
  if (!baseController.isTokenInHeader(request)) {
    return response.status(400).json(baseController.getErrorResponse('No session information'));
  }

  try {
    const sessionService = serviceContainer('session');
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization);

    if (!sessionInfo.data) {
      return response.status(sessionInfo.responseCode).json({message: sessionInfo.message});
    }
    
    let loginData = await authenticationService.revokeToken(sessionInfo.data);

    responseCode = loginData.responseCode;
    responseData = baseController.getSuccessResponse({timeStamp: loginData.data}, loginData.message);
  } catch (err) {
    responseCode = 500;
    const errorMessage = 'Error logging out the app';
    console.error(errorMessage, err);
    responseData = baseController.getErrorResponse(errorMessage);
  }

  return response.status(responseCode).json(responseData);
};

const resetPassword = async (request, response) => {
  if (!request.body.email) {
    return response.status(400).json(baseController.getErrorResponse('Email parameter is missing'));
  }

  try {
    let authenticationData = await authenticationService.resetPassword(request.body.email);

    responseCode = authenticationData.responseCode;
    responseData = baseController.getSuccessResponse(
      authenticationData.data,
      authenticationData.message
    );
  } catch (err) {
    responseCode = 500;
    const errorMessage = 'Error resetting password';
    console.error(errorMessage, err);
    responseData = baseController.getErrorResponse(errorMessage);
  }

  return response.status(responseCode).json(responseData);
};

const create = async (request, response) => {
  if (!request.body.email ||
    !request.body.password ||
    !request.body.name ||
    !request.body.lastName
  ) {
    return response.status(400).json(
      baseController.getErrorResponse('Parameters are missing')
    );
  }

  try {
    const authData = authenticationService.getModel(request.body);

    const authenticationResponse = await authenticationService.createUser(authData);

    responseCode = authenticationResponse.responseCode;
    responseData = baseController.getSuccessResponse(
      authenticationResponse.data,
      authenticationResponse.message
    );
  } catch (error) {
    responseCode = 500;
    const errorMessage = 'Error creating authorization user';
    console.error(errorMessage, error);
    responseData = baseController.getErrorResponse(errorMessage);
  }

  return response.status(responseCode).json(responseData);
};

module.exports = {
  create,
  revokeToken,
  resetPassword
};
