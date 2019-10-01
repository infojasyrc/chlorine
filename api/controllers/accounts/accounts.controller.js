'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

const baseController = new setupBaseController();
const accountsService = serviceContainer('accounts');

const checkBalance = async (request, response) => {

  let responseCode;
  let responseData;

  try {
    const balanceResponse = await accountsService.checkBalance();

    responseCode = balanceResponse.responseCode;
    responseData = baseController.getSuccessResponse(
      balanceResponse.data,
      balanceResponse.message
    );

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
