'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupSessionService (adminAuthInstance) {

  const adminAuth = adminAuthInstance;

  const baseService = new setupBaseService();

  async function getUserSession (idToken) {

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);

      baseService.returnData.data = decodedToken.uid;
      baseService.returnData.message = 'Getting user session information successfully';
    } catch (err) {
      console.error('error: ', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error getting user information';
    }

    return baseService.returnData;
  }

  return {
    getUserSession
  };

};
