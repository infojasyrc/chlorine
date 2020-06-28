'use strict';

const setupBaseController = require('../base.controller');
const serviceContainer = require('../../../../services/service.container');

const baseController = new setupBaseController();
const accountsService = serviceContainer('accounts');
const sessionService = serviceContainer('session');

let responseCode;
let responseData;

const checkBalance = async (request, response) => {
  if (!baseController.isTokenInHeader(request)) {
    return response.status(403).json(baseController.getErrorResponse('No session information'));
  }

  responseCode = 500

  try {
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization);

    if (sessionInfo.data) {
      const balanceResponse = await accountsService.checkBalance(sessionInfo.data);

      responseCode = balanceResponse.responseCode;
      responseData = baseController.getSuccessResponse(
        balanceResponse.data,
        balanceResponse.message
      );
    } else {
      responseCode = sessionInfo.responseCode;
      responseData = baseController.getErrorResponse(sessionInfo.message);
    }

  } catch (err) {
    const errorMessage = 'Error getting balance information'
    /* eslint-disable no-console */
    // console.error(errorMessage, err)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData);
};

const getAll = async (request, response) => {
  if (!baseController.isTokenInHeader(request)) {
    return response.status(400).json(baseController.getErrorResponse('No session information'));
  }

  responseCode = 500

  try {

    const sessionInfo = await sessionService.getUserSession(request.headers.authorization);

    if (sessionInfo.data) {
      const balanceResponse = await accountsService.getAll(sessionInfo.data);

      responseCode = balanceResponse.responseCode;
      responseData = baseController.getSuccessResponse(
        balanceResponse.data,
        balanceResponse.message
      );
    } else {
      responseCode = sessionInfo.responseCode;
      responseData = baseController.getErrorResponse(sessionInfo.message);
    }

  } catch (err) {
    const errorMessage = 'Error getting accounts information'
    /* eslint-disable no-console */
    // console.error(errorMessage, err)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
};

module.exports = {
  checkBalance,
  getAll
}
