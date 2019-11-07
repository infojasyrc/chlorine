'use strict';

const serviceContainer = require('./../../../services/service.container');

const dbService = serviceContainer('authCode');

const authorizationCodeGrantType = 'authorization_code';
const refreshTokenGrantType = 'refresh_token';

const handleAuthorizationCodeGrantType = async (request) => {
  if (!request.body.code) {
    return {responseCode: 404, data: {}};
  }
  return await dbService.getAccessTokenByAuthCode(request.body.code);
};

const handleRefreshTokenGrantType = async (request) => {
  if (!request.body.refresh_token) {
    return {responseCode: 404, data: {}};
  }
  return await dbService.getAccessTokenByRefreshToken(request.body.refresh_token);
};

const accessToken = async (request, response) => {
  if (request.body.grant_type === authorizationCodeGrantType) {
    const responseData = await handleAuthorizationCodeGrantType(request);
    return response.status(responseData.responseCode).json(responseData.data);
  }

  if (request.body.grant_type === refreshTokenGrantType) {
    const responseData = await handleRefreshTokenGrantType(request);
    return response.status(responseData.responseCode).json(responseData.data);
  }

  return response.status(404).json({});
};

module.exports = {
  accessToken
};
