'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupAuthenticationService(clientAdminInstance, adminInstance) {

  const clientAuth = clientAdminInstance;
  const adminAuth = adminInstance;
  const baseService = new setupBaseService();

  async function checkLogin(email, password) {
    let flagAuthentication = false;

    try {
      let loginInfo = await login({
        email: email,
        password: password
      });
      baseService.returnData.message = loginInfo.message;
      flagAuthentication = loginInfo.data.uid !== '';
    } catch (err) {
      console.error('Error on reauthentication process: ', err);
      baseService.returnData.message = 'Error on reauthentication process';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = flagAuthentication;
    }

    return baseService.returnData;
  }

  async function changePasswordUsingAdminSDK(userId, newPassword) {
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
  }

  async function revokeToken(userId) {
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
  }

  async function verifyToken(token) {
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
  }

  return {
    checkLogin,
    changePasswordUsingAdminSDK,
    revokeToken,
    verifyToken
  };
};
