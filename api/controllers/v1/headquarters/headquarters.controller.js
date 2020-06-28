'use strict'

const setupBaseController = require('../base.controller')
const serviceContainer = require('../../../../services/service.container')

let baseController = new setupBaseController()
const headquartersService = serviceContainer('headquarters')

const get = async (request, response) => {
  let responseCode;
  let responseData;

  try {
    const allData = await headquartersService.doList();
    responseCode = allData.responseCode;
    responseData = baseController.getSuccessResponse(
      allData.data,
      allData.message
    );
  } catch (err) {
    console.error('Error getting all headquarters: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting all headquarters');
  }

  return response
    .status(responseCode)
    .json(responseData);
};

module.exports = {
  get
};
