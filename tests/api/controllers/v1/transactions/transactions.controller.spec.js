'use strict';

const test = require('ava');
const sinon = require('sinon');
const { mockRequest, mockResponse } = require('mock-req-res');
const proxyquire = require('proxyquire');

let sandbox;

const transactionDataResponse = {
  id: 'thisIsATransactionId',
  transactionType: 'payment',
  serviceType: 'Luz',
  amount: 200.00,
  accountId: 'thisIsAnAccountId'
};

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

function getController() {
  return proxyquire('./../../../../../api/controllers/v1/transactions/transactions.controller', {
    './../../../../services/service.container': (serviceName) => {
      switch(serviceName) {
        case 'session':
          return {
            getUserSession: () => {
              return Promise.resolve({
                data: 'thisIsAUserId',
                responseCode: 200,
                message: 'Getting session information successfully'
              });
            }
          };
        case 'transactions':
          return {
            formatTransactionDataFromRequest: (data) => {
              return {
                amount: data.amount,
                transactionType: data.transactionType
              };
            },
            makeTransaction: () => {
              return Promise.resolve({
                data: transactionDataResponse,
                responseCode: 200,
                message: 'Getting transaction data successfully'
              });
            },
            validateDataByTransactionType: () => {
              return true;
            }
          };
      }
    }
  });
}

test.serial('submit a payment', async t => {
  const req = mockRequest({
    params: {},
    body: {
      serviceType: 'Luz',
      transactionType: 'payment',
      amount: 200.00
    },
    headers: {
      authorization: 'thisIsAJsonWebToken'
    },
    query: {}
  });
  const res = mockResponse();

  const transactionsController = getController();

  await transactionsController.submitTransaction(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(200), 'Expected response status with success response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('submit a payment: no parameters error request', async t => {
  const req = mockRequest({
    params: {},
    body: {},
    headers: {},
    query: {}
  });
  const res = mockResponse();

  const transactionsController = getController();

  await transactionsController.submitTransaction(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(400), 'Expected 400 response');
  t.true(res.json.called, 'Expected response json was executed');
});

test.serial('submit a payment: no session error request', async t => {
  const req = mockRequest({
    params: {},
    body: {
      serviceType: 'Luz',
      transactionType: 'payment',
      amount: 200.00
    },
    headers: {},
    query: {}
  });
  const res = mockResponse();

  const transactionsController = getController();

  await transactionsController.submitTransaction(req, res);

  t.true(res.status.called, 'Expected response status was executed');
  t.true(res.status.calledWith(403), 'Expected 403 response');
  t.true(res.json.called, 'Expected response json was executed');
});
