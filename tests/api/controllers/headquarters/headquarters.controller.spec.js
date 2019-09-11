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
let firebaseAdminApplication = null;
let firebaseApplication = null;
let headquarterService;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  firebaseApplication = {
    auth: sinon.stub(),
    storage: sinon.stub()
  };

  firebaseAdminApplication = {
    auth: sinon.stub(),
    firestore: sinon.stub()
  };

  headquarterService = {};
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test.serial('Get headquarters', async t => {
  const req = mockRequest({});
  const res = mockResponse();

  headquarterService.doList = sandbox.stub();
  headquarterService
    .doList
    .returns(Promise.resolve({
      responseCode: 200,
      data: [],
      message: ''
    }));

  const setupDBService = proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => headquarterService,
    './storage.service': () => {}
  });

  headquarterController = proxyquire('./../../../../api/controllers/headquarters/headquarters.controller', {
    './../../../database': setupDBService
  });

  await headquarterController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
