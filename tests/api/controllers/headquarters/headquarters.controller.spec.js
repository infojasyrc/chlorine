'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

let sandbox = null;

let headquarterController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(headquarterService) {
  const firebaseApplication = {
    auth: sinon.stub()
  };

  const firebaseAdminApplication = {
    auth: sinon.stub(),
    firestore: sinon.stub(),
    storage: () => {
      return {
        bucket: () => {}
      };
    }
  };

  return proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './auth.codes.service': () => {},
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => headquarterService,
    './storage.service': () => {},
    './accounts.service': () => {},
    './transactions.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/headquarters/headquarters.controller', {
    './../../../database': allServices
  });
}

test.serial('Get headquarters', async t => {
  const req = mockRequest({});
  const res = mockResponse();

  const headquarterService = {};
  headquarterService.doList = sandbox.stub();
  headquarterService
    .doList
    .returns(Promise.resolve({
      responseCode: 200,
      data: [],
      message: ''
    }));

  const setupDBService = getSetupDBService(headquarterService);

  headquarterController = getController(setupDBService);

  await headquarterController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
