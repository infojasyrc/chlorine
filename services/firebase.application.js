'use strict';

const admin = require('firebase');
const serviceAccount = require('./../services-config/app.web.json');

let app = null;

module.exports = function setupFirebaseApplication() {
  if (!app) {
    app = admin.initializeApp(serviceAccount);
  }

  return app;
};
