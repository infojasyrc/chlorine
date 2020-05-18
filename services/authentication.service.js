'use strict';

const setupBaseService = require('./base.service');

module.exports = (adminInstance) => {

  const adminAuth = adminInstance;
  const baseService = new setupBaseService();

  const changePasswordUsingAdminSDK = async (userId, newPassword) => {
    try {
      const response = await adminAuth.updateUser(userId, {
        password: newPassword
      });

      baseService.returnData.data = response;
      baseService.returnData.message = 'Change password successfully';
    } catch (err) {
      const errorMessage = 'Error updating user password';
      console.error(errorMessage, err);
      baseService.returnData.message = errorMessage;
      baseService.returnData.responseCode = 500;
    }

    return baseService.returnData;
  };


  /**
   * Create an authentication user
   * @param {Object} userData 
   * @returns {Object}
   */
  const createUser = async userData => {
    let response;

    try {
      const authResponse = await adminAuth.createUser(userData);
      const successMessage = 'Authentication created successfully';
      response = baseService.getSuccessResponse({...authResponse}, successMessage);

    } catch (error) {
      const errorMessage = 'Error creating user auth';
      console.error(errorMessage, error);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  const revokeToken = async (userId) => {
    try {
      await adminInstance.revokeRefreshTokens(userId);
      const userRecord = await adminAuth.getUser(userId);
      const revokeTimeStamp = new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
      console.info('revoke time', revokeTimeStamp);
      baseService.returnData.message = 'Sign out successfully';
      baseService.returnData.data = {};
    } catch (err) {
      console.error('Error sign out: ', err);
      baseService.returnData.message = 'Error sign out';
      baseService.returnData.responseCode = 500;
    }

    return baseService.returnData;
  };

  const verifyToken = async (token) => {
    let responseData = {
      verified: false
    };

    try {
      const currentToken = await adminAuth.verifyIdToken(token);

      if (!currentToken) {
        return {
          message: 'Unverified Token',
          data: responseData
        };
      }

      baseService.returnData.message = 'Successfully verified Token',
        responseData.verified = true;
    } catch (error) {
      console.error('Error while verifying token id', error);
      baseService.returnData.message = 'Error while verifying token id';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = responseData;
    }

    return baseService.returnData;
  };

  return {
    changePasswordUsingAdminSDK,
    createUser,
    revokeToken,
    verifyToken
  };
};
