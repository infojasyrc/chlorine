'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

let sandbox = null;

let roleController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(roleService) {
  const firebaseApplication = {
    auth: sinon.stub()
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

  return proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => {},
    './roles.service': () => roleService,
    './headquarters.service': () => {},
    './storage.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/roles/role.controller', {
    './../../../database': allServices
  });
}

test.serial('Get role information: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let roleService = {};
  const setupDBService = getSetupDBService(roleService);

  roleController = getController(setupDBService);

  await roleController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Get role information: retrieve data', async t => {
  const req = mockRequest({
    params: {
      id: 'aaaaaaaaaa'
    }
  });
  const res = mockResponse();

  let roleService = {};
  roleService.getRole = sandbox.stub();
  roleService
    .getRole
    .withArgs(req.params.id)
    .returns(Promise.resolve({
      responseCode: 200,
      data: {},
      message: ''
    }));

  const setupDBService = getSetupDBService(roleService);

  roleController = getController(setupDBService);

  await roleController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
