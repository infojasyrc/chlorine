'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const setupTransactionsService = proxyquire('./../../database/transactions.service', {
  './accounts.service': () => {
    return {
      getDefaultAccount: () => {
        return Promise.resolve({
          data: {
            id: 'accountId',
            name: 'Cuenta Corriente',
            balance: 2000.00,
            default: true
          },
          message: '',
          responseCode: 200
        });
      },
      updateBalance: () => {
        return Promise.resolve({
          data: {},
          responseCode: 200,
          message: ''
        });
      }
    }
  }
});

const collectionKey = 'payments';
let sandbox = null;
const dbInstanceStub = {};
let transactionsService;
const userId = 'thisIsAUserId';

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  dbInstanceStub.collection = sandbox.stub();
  dbInstanceStub.collection
    .withArgs(collectionKey)
    .returns({
      add: (transactionData) => {
        return Promise.resolve({
          id: 'newTransactionDocumentId'
        })
      }
    });

  transactionsService = setupTransactionsService(dbInstanceStub);
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test.serial('Pay service', async t => {
  const requestParameters = {
    transactionType: 'payment',
    serviceType: 'luz',
    amount: 100.00
  };
  const paymentInfo = await transactionsService.makeTransaction(userId, requestParameters);

  t.true(paymentInfo.hasOwnProperty('message'), 'Expected message key');
  t.true(paymentInfo.hasOwnProperty('data'), 'Expected data key');
  t.true(paymentInfo.data.hasOwnProperty('id'), 'Expected data key');
  t.true(paymentInfo.data.hasOwnProperty('transactionType'), 'Expected data key');
  t.true(paymentInfo.data.hasOwnProperty('serviceType'), 'Expected data key');
  t.true(paymentInfo.data.hasOwnProperty('amount'), 'Expected data key');
});
