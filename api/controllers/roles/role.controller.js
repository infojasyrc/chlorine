'use strict';

const setupBaseController = require('../base.controller');
const setupDBService = require('../../../database');

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
    const roleData = await dbService.rolesService.getRole(request.params.id);

    responseCode = roleData.responseCode;
    responseData = baseController.getSuccessResponse(
      roleData.data,
      roleData.message
    );
  } catch (err) {
    console.error('Error getting role information: ', err);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error getting role information');
  }

  return response
    .status(responseCode)
    .json(responseData);
};

module.exports = {
  get
};
