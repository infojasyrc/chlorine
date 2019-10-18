'use strict';

const setupBaseController = require('./../base.controller');
const serviceContainer = require('./../../../database/service.container');

let baseController = new setupBaseController();
const dbService = serviceContainer('authCode');

let responseCode;
let responseData;

const accessToken = async (request, response) => {
  if (request.body.gran_type === 'authorization_code') {
    return dbService.getAccessTokenByAuthCode(request.body.code);
  } else if (request.body.gran_type === 'refresh_token') {
    return dbService.getAccessTokenByRefreshToken(request.body.refresh_token);
  } else {
    return response.send(404);
  }

  return response.status(responseCode).json(responseData);
};

module.exports = {
  accessToken
};
