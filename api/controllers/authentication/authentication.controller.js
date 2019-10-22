'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

let baseController = new setupBaseController();
const authenticationService = serviceContainer('authentication');
const userService = serviceContainer('users');
const authCodesService = serviceContainer('authCode');

let responseCode;
let responseData;

const login = async (request, response) => {
  if (!request.body.email || !request.body.password) {
    return response
      .status(400)
      .json(baseController.getErrorResponse('Paramaters are missing'));
  }

  try {
    let authenticationData = {
      email: request.body.email,
      password: request.body.password
    };

    let loginData = await authenticationService.login(authenticationData);
    const authCodeInfo = await authCodesService.addAuthCode(loginData.data.uid);
    const user = await userService.findByUserId(loginData.data.uid);

    loginData.data.user = user.data;
    loginData.data.code = authCodeInfo.data.code;

    responseCode = loginData.responseCode;
    responseData = baseController.getSuccessResponse(loginData.data, loginData.message);
  } catch (err) {
    console.error('Error logging in the application: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error logging in the application');
  }

  return response.status(responseCode).json(responseData);
};

const logout = async (request, response) => {

  try {
    let loginData = await authenticationService.logout();

    responseCode = loginData.responseCode;
    responseData = baseController.getSuccessResponse({}, loginData.message);
  } catch (err) {
    responseCode = 500;
    console.error('Error logging out the app: ', err);
    responseData = baseController.getErrorResponse('Error logging out the app');
  }

  return response.status(responseCode).json(responseData);
};

const resetPassword = async (request, response) => {
  if (!request.body.email) {
    return response
      .status(400)
      .json(baseController.getErrorResponse('Email parameter is missing'));
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
    console.error('Error resetting password: ', err);
    responseData = baseController.getErrorResponse('Error resetting password');
  }

  return response.status(responseCode).json(responseData);
};

module.exports = {
  login,
  logout,
  resetPassword
};
