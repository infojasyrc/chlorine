'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

let baseController = new setupBaseController();
const dbService = serviceContainer('token');

let responseCode;
let responseData;

const accessToken = async (request, response) => {
  return response.status(responseCode).json(responseData);
};

module.exports = {
  accessToken
};
