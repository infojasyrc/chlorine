'use strict';

const setupBaseController = require('./../base.controller');
const setupDBService = require('./../../../database');

let baseController = new setupBaseController();
const dbService = setupDBService();

const get = async (request, response) => {
  if (!request.params.id) {
    return response
      .status(400)
      .json(baseController.getErrorResponse('Parameter is missing'));
  }

  let responseCode;
  let responseData;

  try {
    const headquarterData = await dbService.headquartersService.getHeadquarter(request.params.id);
    responseCode = headquarterData.responseCode;
    responseData = baseController.getSuccessResponse(
      headquarterData.data,
      headquarterData.message
    );
  } catch (err) {
    console.error('Error getting headquarter information: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting headquarter information');
  }

  return response
    .status(responseCode)
    .json(responseData);
};

module.exports = {
  get
};
