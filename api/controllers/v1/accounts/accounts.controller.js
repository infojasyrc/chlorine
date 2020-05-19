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
    console.error('Error getting balance: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting balance information');
  }

  return response.status(responseCode).json(responseData);
};

const getAll = async (request, response) => {
  if (!baseController.isTokenInHeader(request)) {
    return response.status(400).json(baseController.getErrorResponse('No session information'));
  }

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
    console.error('Error getting all accounts: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting accounts information');
  }

  return response.status(responseCode).json(responseData);
};

module.exports = {
  checkBalance,
  getAll
};
