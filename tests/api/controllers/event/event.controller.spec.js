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

let eventController;
let firebaseAdminApplication = null;
let firebaseApplication = null;
let eventsService = null;
let baseController;

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

  eventsService = {};

  baseController = new setupBaseController();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getSetupDBService(eventsService, storageService) {
  const mockStorageService = storageService ? storageService : {};

  return proxyquire('./../../../../database', {
    './firebase.application': () => firebaseApplication,
    './firebase-admin.application': () => firebaseAdminApplication,
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => eventsService,
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => {},
    './storage.service': () => mockStorageService
  });
}

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/event/event.controller', {
    './../../../database': allServices
  });
}

test.serial('Check get event: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Check get event: retrieve event', async t => {
  const eventId = 'aaaaaaaaa';
  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();
  const eventServiceResponse = {
    data: {
      id: eventId
    },
    message: 'Getting event information successfully',
    responseCode: 200
  };

  eventsService.findById = sandbox.stub();
  eventsService
    .findById
    .withArgs(eventId)
    .returns(Promise.resolve(eventServiceResponse));

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.get(req, res);

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

test.serial('Check get event: catch error', async t => {
  const eventId = 'aaaaaaaaa';
  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();

  eventsService.findById = sandbox.stub();
  eventsService
    .findById
    .withArgs(eventId)
    .returns(Promise.reject());

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(500), 'Expected response status with error response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Add attendees: success response', async t => {
  const eventId = 'aaaaaaaaa';
  const attendees = [{
      name: 'Juan Perez'
    },
    {
      name: 'Andres Ivan'
    }
  ];

  const req = mockRequest({
    params: {
      id: eventId
    },
    body: {
      attendees: attendees
    }
  });

  const res = mockResponse();
  const eventServiceResponse = {
    responseCode: 200,
    data: {
      id: eventId,
      attendees: attendees
    },
    message: ''
  };

  eventsService.addAttendees = sandbox.stub();
  eventsService
    .addAttendees
    .withArgs(eventId, attendees)
    .returns(Promise.resolve(eventServiceResponse));

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.addAttendees(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(eventServiceResponse.responseCode), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
  t.true(res.json.calledWith({
    status: baseController.successStatus,
    data: eventServiceResponse.data,
    message: eventServiceResponse.message
  }), 'Expected response json was executed');
});

test.serial('Delete event: success response and no images', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN';
  const infoEventServiceResponse = {
    data: {
      images: []
    },
    message: 'Getting event information successfully',
    responseCode: 200
  };
  const deleteEventServiceResponse = {
    data: {},
    message: 'Event removed successfully',
    responseCode: 200
  };

  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();

  eventsService.findById = sandbox.stub();
  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));
  eventsService.remove = sandbox.stub();
  eventsService.remove
    .withArgs(eventId)
    .returns(Promise.resolve(deleteEventServiceResponse));

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Delete event: success response with images', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN';
  const infoEventServiceResponse = {
    data: {
      images: [{
        id: '0e2a46f4-e21b-4db6-a724-dadbca3b34fc',
        url: 'https://firebasestorage.googleapis.com/2F0e2a46f4aaaa-e21bcccc-4db6-a724-dadbca3b34fc'
      }]
    },
    message: 'Getting event information successfully',
    responseCode: 200
  };
  const deleteEventServiceResponse = {
    data: {},
    message: 'Event removed successfully',
    responseCode: 200
  };
  let storageService = {};

  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();

  eventsService.findById = sandbox.stub();
  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));
  eventsService.remove = sandbox.stub();
  eventsService.remove
    .withArgs(eventId)
    .returns(Promise.resolve(deleteEventServiceResponse));

  storageService.eraseList = sandbox.stub();

  const setupDBService = getSetupDBService(eventsService, storageService);

  eventController = getController(setupDBService);

  await eventController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Delete event: error response', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN';
  const infoEventServiceResponse = {
    data: {
      images: []
    },
    message: 'Getting event information successfully',
    responseCode: 200
  };

  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();

  eventsService.findById = sandbox.stub();
  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));
  eventsService.remove = sandbox.stub();
  eventsService
    .remove
    .withArgs(eventId)
    .returns(Promise.reject());

  const setupDBService = getSetupDBService(eventsService);

  eventController = getController(setupDBService);

  await eventController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(500), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
