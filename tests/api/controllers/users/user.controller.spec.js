'use strict';

const test = require('ava');
const sinon = require('sinon');
const {
  mockRequest,
  mockResponse
} = require('mock-req-res');
const proxyquire = require('proxyquire');

const setupBaseController = require('../../../../api/controllers/base.controller');

let sandbox = null;

let userController;
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

  return proxyquire('./../../../../services', {
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
  return proxyquire('./../../../../api/controllers/users/user.controller', {
    './../../../services': allServices
  });
}

test.serial('Get user: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let userService = {};
  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.get(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(400),
    'Expected response status with an error response'
  );
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Get user: retrieve data', async t => {
  const userId = 'aaaaaaaaaaaaa';
  const req = mockRequest({
    params: {
      id: userId
    }
  });
  const res = mockResponse();
  const userServiceResponse = {
    responseCode: 200,
    data: [],
    message: 'Getting user information successfully'
  };

  let userService = {};
  userService.findById = sandbox.stub();
  userService
    .findById
    .withArgs(userId)
    .returns(Promise.resolve(userServiceResponse));

  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.get(req, res);

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

test.serial('Create user: validate params', async t => {
  const req = mockRequest({
    body: {
      name: 'Juan',
      lastName: 'Perez',
      role: {}
    }
  });
  const res = mockResponse();

  let userService = {};
  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.post(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(400),
    'Expected response status with an error response for missing parameters'
  );
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Create user: success response', async t => {
  const userPostData = {
    name: 'Juan',
    lastName: 'Perez',
    email: 'test@unittest.com',
    role: {}
  };

  const req = mockRequest({
    body: userPostData
  });
  const res = mockResponse();
  const userServiceResponse = {
    responseCode: 200,
    data: {},
    message: 'Adding user successfully'
  };

  let userService = {};
  userService.create = sandbox.stub();
  userService
    .create
    .returns(Promise.resolve(userServiceResponse));

  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.post(req, res);

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

test.serial('Update user: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let userService = {};
  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.update(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(400),
    'Expected response status with an error response for missing parameters'
  );
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Update user: success response', async t => {
  const userId = 'aaaaaaaaaaaaaa';
  const userPostData = {
    name: 'Juan',
    lastName: 'Perez',
    email: 'test@unittest.com',
    role: {},
    isAdmin: false,
    disabled: false
  };

  const req = mockRequest({
    params: {
      id: userId
    },
    body: userPostData
  });
  const res = mockResponse();
  const userServiceResponse = {
    responseCode: 200,
    data: {},
    message: 'Updating user successfully'
  };

  let userService = {};
  userService.update = sandbox.stub();
  userService
    .update
    .returns(Promise.resolve(userServiceResponse));

  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.update(req, res);

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

test.serial('Remove user: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  let userService = {};
  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(400),
    'Expected response status with an error response for missing parameters'
  );
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Remove user: success response', async t => {
  const userId = 'aaaaaaaaaaaaaa';

  const req = mockRequest({
    params: {
      id: userId
    }
  });
  const res = mockResponse();
  const userServiceResponse = {
    responseCode: 200,
    data: {},
    message: 'Removing user successfully'
  };

  let userService = {};
  userService.toggleEnable = sandbox.stub();
  userService
    .toggleEnable
    .returns(Promise.resolve(userServiceResponse));

  const setupDBService = getSetupDBService(userService);

  userController = getController(setupDBService);

  await userController.remove(req, res);

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
