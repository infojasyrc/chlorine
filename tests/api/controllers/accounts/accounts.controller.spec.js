'use strict';

const test = require('ava');
const sinon = require('sinon');
const {mockRequest, mockResponse} = require('mock-req-res');
const proxyquire = require('proxyquire');

const setupBaseController = require('./../../../../api/controllers/base.controller');

let sandbox = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getController() {
  return proxyquire('./../../../../api/controllers/accounts/accounts.controller', {
    './../../../database/service.container': (serviceName) => {
      switch(serviceName) {
        case 'accounts':
          return {
            checkBalance: () => {
              return Promise.resolve({
                responseCode: 200,
                data: [],
                message: 'Getting data successfully'
              });
            }
          };
        case 'session':
          return {
            getUserSession: () => {
              return Promise.resolve({
                responseCode: 200,
                data: 'thisIsAUserId',
                message: 'Getting data successfully'
              });
            }
          };
      }
    }
  });
}

test.serial('Check get balance: success response', async t => {
  const req = mockRequest({
    params: {},
    body: {},
    headers: {
      authorization: 'thisIsAUserToken'
    },
    query: {}
  });
  const res = mockResponse();

  const accountsController = getController();

  await accountsController.checkBalance(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('Check get balance: Response 400 for no token information', async t => {
  const req = mockRequest({
    params: {},
    body: {},
    headers: {},
    query: {}
  });
  const res = mockResponse();

  const accountsController = getController();

  await accountsController.checkBalance(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected 400 response');
  t.true(res.json.called, 'Expected response json was executed');
});
