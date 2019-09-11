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
    firestore: sinon.stub()
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
    './storage.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/authentication/authentication.controller', {
    './../../../database': allServices
  });
}

test.serial('Login: validate parameters', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let authenticationService = {};
  const setupDBService = getSetupDBService(authenticationService, {});

  authenticationController = getController(setupDBService);

  await authenticationController.login(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Login: Get user information', async t => {
  const req = mockRequest({
    params: {},
    body: {
      email: 'test@email.com',
      password: 'ultrasecret'
    }
  });
  const res = mockResponse();

  let authenticationService = {};
  authenticationService.login = sandbox.stub();
  authenticationService
    .login
    .withArgs({
      email: req.body.email,
      password: req.body.password
    })
    .returns(Promise.resolve({
      responseCode: 200,
      data: {
        uid: 'abcdefg'
      },
      message: ''
    }));

  let userService = {};
  userService.findByUserId = sandbox.stub();
  userService
    .findByUserId
    .returns(
      Promise.resolve({
        responseCode: 200,
        data: {},
        message: ''
      })
    );

  const setupDBService = getSetupDBService(authenticationService, userService);

  authenticationController = getController(setupDBService);

  await authenticationController.login(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Logout', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let authenticationService = {};
  authenticationService.logout = sandbox.stub();
  authenticationService
    .logout
    .returns(
      Promise.resolve({
        responseCode: 200,
        data: {},
        message: ''
      }));

  const setupDBService = getSetupDBService(authenticationService, {});

  authenticationController = getController(setupDBService);

  await authenticationController.logout(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
