'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

const baseController = new setupBaseController();
const accountsService = serviceContainer('accounts');
const sessionService = serviceContainer('session');

const checkBalance = async (request, response) => {

  let responseCode;
  let responseData;

  if (!request.headers.authorization) {
    return response.status(400).json(baseController.getErrorResponse('No session information'));
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
    console.error('Error getting all balance: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting balance information');
  }

  return response.status(responseCode).json(responseData);
}

module.exports = {
  checkBalance
};
