'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

const setupBaseController = require('../../../../../api/controllers/v1/base.controller');

let sandbox = null;

let eventController;
let eventsService = null;
const mockStorageService = {};
let baseController;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  eventsService = {};
  eventsService.findById = sandbox.stub();
  eventsService.remove = sandbox.stub();
  eventsService.addAttendees = sandbox.stub();

  mockStorageService.eraseList = sandbox.stub();

  baseController = new setupBaseController();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

const getController = service => {
  return proxyquire('./../../../../../api/controllers/v1/events/event.controller', {
    './../../../../services/service.container': serviceName => {
      switch (serviceName) {
        case 'events':
        default:
          return {
            addAttendees: service.addAttendees,
            findById: service.findById,
            remove: service.remove
          };
        case 'storage':
          return {
            eraseList: mockStorageService.eraseList
          };
      }
    }
  });
};

test.serial('Check get event: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  eventController = getController(eventsService);

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

  eventsService
    .findById
    .withArgs(eventId)
    .returns(Promise.resolve(eventServiceResponse));

  eventController = getController(eventsService);

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

  eventsService
    .findById
    .withArgs(eventId)
    .returns(Promise.reject());

  eventController = getController(eventsService);

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

  eventsService
    .addAttendees
    .withArgs(eventId, attendees)
    .returns(Promise.resolve(eventServiceResponse));

  eventController = getController(eventsService);

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

  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));

  eventsService.remove
    .withArgs(eventId)
    .returns(Promise.resolve(deleteEventServiceResponse));

  eventController = getController(eventsService);

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

  const req = mockRequest({
    params: {
      id: eventId
    }
  });
  const res = mockResponse();

  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));

  eventsService.remove
    .withArgs(eventId)
    .returns(Promise.resolve(deleteEventServiceResponse));

  eventController = getController(eventsService);

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

  eventsService.findById
    .withArgs(eventId)
    .returns(Promise.resolve(infoEventServiceResponse));

  eventsService
    .remove
    .withArgs(eventId)
    .returns(Promise.reject());

  eventController = getController(eventsService);

  await eventController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(500), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
