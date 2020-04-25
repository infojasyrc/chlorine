'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');

const setupBaseController = require('./../../../../../api/controllers/v1/base.controller');

let sandbox = null;

let usersController;
let baseController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  baseController = new setupBaseController();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(userService) {
  const getMockProviders = () => {
    return {
      clientAuth: sinon.stub(),
      adminAuth: sinon.stub(),
      dbInstance: sinon.stub(),
      storage: () => {
        return {
          bucket: sinon.stub()
        };
      }
    };
  };

  return proxyquire('./../../../../../services', {
    './../providers': getMockProviders,
    './auth.codes.service': () => {},
    './user.service': () => userService,
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => {},
    './storage.service': () => {},
    './accounts.service': () => {},
    './transactions.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../../api/controllers/v1/users/users.controller', {
    './../../../../services': allServices
  });
}

test.serial('Get all users', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  const userServiceResponse = {
    responseCode: 200,
    data: [],
    message: ''
  };

  let userService = {};
  userService.doList = sandbox.stub();
  userService
    .doList
    .returns(Promise.resolve(userServiceResponse));

  const setupDBService = getSetupDBService(userService);

  usersController = getController(setupDBService);

  await usersController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(userServiceResponse.responseCode),
    'Expected response status with success response'
  );
  t.true(res.json.called, 'Expected response json was executed');
  t.true(
    res.json.calledWith({
      status: baseController.successStatus,
      data: userServiceResponse.data,
      message: userServiceResponse.message
    }),
    'Expected response json was executed'
  );
});
