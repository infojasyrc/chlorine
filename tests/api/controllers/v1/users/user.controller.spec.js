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

let userController;
let baseController;
let userService;
const mockUserService = {};
const authenticationService = {};

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  const mockDBInstance = {};
  mockDBInstance.collection = sandbox.stub();

  mockUserService.findById = sandbox.stub();
  mockUserService.findByUserId = sandbox.stub();
  mockUserService.create = sandbox.stub();
  mockUserService.toggleEnable = sandbox.stub();
  mockUserService.update = sandbox.stub();
  mockUserService.getModel = sandbox.stub();

  authenticationService.changePasswordUsingAdminSDK = sandbox.stub();
  authenticationService.changeAvailability = sandbox.stub();

  baseController = new setupBaseController();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

const getController = () => {
  return proxyquire('./../../../../../api/controllers/v1/users/user.controller', {
    './../../../../services/service.container': (service) => {
      switch(service) {
        case 'users':
        default: {
          return mockUserService;
        }
        case 'authentication': {
          return authenticationService;
        }
      }
    }
  });
};

test.serial('Get user: validate params', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  userController = getController();

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

  mockUserService.findById.withArgs(userId).returns(
    Promise.resolve(userServiceResponse)
  );

  userController = getController();

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

  userController = getController();

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
    role: {},
    uid: 'ThisIsAUserUId'
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

  mockUserService.create.returns(
    Promise.resolve(userServiceResponse)
  );

  userController = getController();

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

  userController = getController();

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

  mockUserService.update.returns(
    Promise.resolve(userServiceResponse)
  );

  userController = getController();

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

  userController = getController();

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
    data: {
      userId: 'ThisIsAUserId',
      name: 'Juan',
      lastName: 'Perez',
      isAdmin: false,
      isEnabled: false
    },
    message: 'User was disabled successfully'
  };
  const authResponse = {
    responseCode: 200,
    data: {
      email: 'test@email.com',
      disabled: true,
    },
    message: 'User was disabled successfully'
  };

  mockUserService.toggleEnable.returns(
    Promise.resolve(userServiceResponse)
  );

  authenticationService.changeAvailability.returns(
    Promise.resolve(authResponse)
  );

  userController = getController();

  await userController.remove(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(
    res.status.calledWith(userServiceResponse.responseCode),
    'Expected response status with success response'
  );
  t.true(res.json.called, 'Expected response json was executed');
});
