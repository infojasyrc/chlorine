'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

const setupBaseController = require('./../../../../api/controllers/base.controller');

let sandbox = null;

let eventsController;
let baseController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  baseController = new setupBaseController();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(eventsService) {
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

  return proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => eventsService,
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => {},
    './storage.service': () => {},
    './accounts.service': () => {},
    './transactions.service': () => {}
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/events/events.controller', {
    './../../../database': allServices
  });
}

test.serial('Check get events: validate params', async t => {
  const req = mockRequest({
    params: {},
    query: {}
  });
  const res = mockResponse();

  let eventsService = {};
  const setupDBService = getSetupDBService(eventsService);

  eventsController = getController(setupDBService);

  await eventsController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected response status with failure response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Check get events: retrieve all', async t => {
  const requestParameters = {
    params: {},
    query: {
      headquarterId: 'headquarterId'
    }
  };
  const req = mockRequest(requestParameters);
  const res = mockResponse();
  const eventServiceResponse = {
    responseCode: 200,
    data: [],
    message: 'Getting events information successfully'
  };

  const eventsParameters = {
    year: new Date().getFullYear(),
    headquarterId: requestParameters.query.headquarterId,
    showAll: false,
    withAttendees: false
  };

  const eventsService = {};
  eventsService.doList = sandbox.stub();
  eventsService
    .doList
    .withArgs(eventsParameters)
    .returns(Promise.resolve(eventServiceResponse));

  const setupDBService = getSetupDBService(eventsService);

  eventsController = getController(setupDBService);

  await eventsController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(eventServiceResponse.responseCode), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
  t.true(res.json
    .calledWith({
      status: baseController.successStatus,
      data: eventServiceResponse.data,
      message: eventServiceResponse.message
    }), 'Expected response json was executed');
});

test.serial('Check get events: catch error', async t => {
  const requestParameters = {
    params: {},
    query: {
      headquarterId: 'headquarterId'
    }
  };
  const req = mockRequest(requestParameters);
  const res = mockResponse();

  const eventsParameters = {
    year: new Date().getFullYear(),
    headquarterId: requestParameters.query.headquarterId,
    showAll: false,
    withAttendees: false
  };

  let eventsService = {};
  eventsService.doList = sandbox.stub();
  eventsService
    .doList
    .withArgs(eventsParameters)
    .returns(Promise.reject());

  const setupDBService = getSetupDBService(eventsService);

  eventsController = getController(setupDBService);

  await eventsController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(500), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Check get events with attendees: retrieve all', async t => {
  const requestParameters = {
    params: {},
    query: {
      withAttendees: 'true',
      headquarterId: 'headquarterId'
    }
  };
  const req = mockRequest(requestParameters);
  const res = mockResponse();
  const eventServiceResponse = {
    data: [],
    message: 'Getting events information successfully',
    responseCode: 200
  };

  const eventsParameters = {
    year: new Date().getFullYear(),
    headquarterId: requestParameters.query.headquarterId,
    showAll: false,
    withAttendees: true
  };

  const eventsService = {};
  eventsService.doList = sandbox.stub();
  eventsService
    .doList
    .withArgs(eventsParameters)
    .returns(Promise.resolve(eventServiceResponse));

  const setupDBService = getSetupDBService(eventsService);

  eventsController = getController(setupDBService);

  await eventsController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(eventServiceResponse.responseCode), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
  t.true(res.json
    .calledWith({
      status: baseController.successStatus,
      data: eventServiceResponse.data,
      message: eventServiceResponse.message
    }), 'Expected response json was executed');
});
