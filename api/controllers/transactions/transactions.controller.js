'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

const baseController = new setupBaseController();
const transactionsService = serviceContainer('transactions');
const sessionService = serviceContainer('session');

let responseCode;
let responseData;

const submitTransaction = async (request, response) => {
  if (!request.body.serviceType ||
    !request.body.transactionType ||
    !request.body.amount
  ) {
    return response.status(400).json(baseController.getErrorResponse('Parameters are missing'));
  }
  // Access forbidden
  if (!baseController.isTokenInHeader(request)) {
    return response.status(403).json(baseController.getErrorResponse('No session information'));
  }

  try {
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization);

    if (!sessionInfo.data) {
      responseCode = sessionInfo.responseCode;
      responseData = baseController.getErrorResponse(sessionInfo.message);
      return response.status(responseCode).json(responseData);
    }

    const transactionResponse = await transactionsService.makeTransaction(
      sessionInfo.data,
      { ...request.body }
    );

    if (transactionResponse.responseCode !== 200) {
      responseCode = transactionResponse.responseCode;
      responseData = baseController.getErrorResponse(transactionResponse.message);
      return response.status(responseCode).json(responseData);
    }

    responseCode = transactionResponse.responseCode;
    responseData = baseController.getSuccessResponse(
      transactionResponse.data,
      transactionResponse.message
    );

  } catch (err) {
    const errorMessage = 'Error on submitting a transaction';
    console.error(errorMessage, err);
    responseCode = 500;
    responseData = baseController.getErrorResponse(errorMessage);
  }

  return response.status(responseCode).json(responseData);
}

module.exports = {
  submitTransaction
};
