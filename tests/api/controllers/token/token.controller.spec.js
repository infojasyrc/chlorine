'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

let sandbox = null;

let authenticationController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(authenticationService, userService) {
  const firebaseApplication = {
    auth: sinon.stub(),
    storage: sinon.stub()
  };

  const firebaseAdminApplication = {
    auth: sinon.stub(),
    firestore: sinon.stub(),
    storage: () => {
      return {
        bucket: () => {}
      }
    }
  };

  if (!userService) {
    userService = {};
  }

  return proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './user.service': () => userService,
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => authenticationService,
    './roles.service': () => {},
    './headquarters.service': () => {},
    './storage.service': () => {},
    './accounts.service': () => {},
    './transactions.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/token/token.controller', {
    './../../../database': allServices
  });
}

test.serial('Access token: get access token ', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  const setupDBService = getSetupDBService(authenticationService, {});

  authenticationController = getController(setupDBService);

  await authenticationController.accessToken(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Access token: get refresh token ', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  const setupDBService = getSetupDBService(authenticationService, {});

  authenticationController = getController(setupDBService);

  await authenticationController.accessToken(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
