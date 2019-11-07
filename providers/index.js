'use strict';

const setupFirebaseWebSDKApp = require('./firebase.application');
const setupFirebaseAdminSDKApp = require('./firebase-admin.application');

module.exports = function () {
  const webSDK = setupFirebaseWebSDKApp();
  const adminSDK = setupFirebaseAdminSDKApp();

  const clientAuth = webSDK.auth();
  const adminAuth = adminSDK.auth();
  const dbInstance = adminSDK.firestore();
  const bucket = adminSDK.storage().bucket();

  return {
    clientAuth,
    adminAuth,
    dbInstance,
    bucket
  };

};