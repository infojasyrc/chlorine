'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('./../services-config/app.json');

let app = null;

module.exports = function setupFirebaseApplication() {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://spidernode-app.firebaseio.com',
      storageBucket: 'spider-node-app.appspot.com',
    });
  }

  return app;
};
