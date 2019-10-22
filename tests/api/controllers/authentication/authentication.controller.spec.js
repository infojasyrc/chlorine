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

function getController(allServices) {
  return proxyquire('./../../../../api/controllers/authentication/authentication.controller', {
    './../../../database/service.container': (service) => {
      switch(service) {
        default:
        case 'authentication':
          return {
            login: () => {
              return Promise.resolve({
                responseCode: 200,
                data: {
                  uid: 'abcdefg'
                },
                message: ''
              });
            },
            logout: () => {
              return Promise.resolve({
                responseCode: 200,
                data: {}
              });
            }
          };
        case 'users':
          return {
            findByUserId: () => {
              return Promise.resolve({
                responseCode: 200,
                data: {},
                message: ''
              });
            }
          };
        case 'authCode':
          return {
            addAuthCode: () => {
              return Promise.resolve({
                responseCode: 200,
                data: {
                  userId: 'thisIsAUserId',
                  code: 'thisIsAnAuthCode',
                  created: Date()
                }
              });
            }
          };
      }
    }
  });
}

test.serial('Login: validate parameters', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  authenticationController = getController();

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

  authenticationController = getController();

  await authenticationController.login(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
  console.log(res.json.calledWith());
});

test.serial('Logout', async t => {
  const req = mockRequest({
    params: {}
  });
  const res = mockResponse();

  authenticationController = getController();

  await authenticationController.logout(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});
