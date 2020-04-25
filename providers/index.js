'use strict';

const setupFirebaseAdminSDKApp = require('./firebase-admin.application');

module.exports = () => {  
  const adminSDK = setupFirebaseAdminSDKApp();

  const adminAuth = adminSDK.auth();
  const dbInstance = adminSDK.firestore();
  const bucket = adminSDK.storage().bucket();

  return {
    adminAuth,
    dbInstance,
    bucket
  };

};