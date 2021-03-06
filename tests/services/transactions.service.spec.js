'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const setupTransactionsService = proxyquire('./../../services/transactions.service', {
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
    };
  }
});

const collectionKey = 'transactions';
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
        });
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

test.skip('Validate data according transaction type: not valid for payment', t => {
  const transactionData = {
    transactionType: 'payment',
    amount: 120.00
  };
  const result = transactionsService.validateDataByTransactionType(transactionData);

  t.false(result, 'Expected not valid data for payment');
});

test.serial('Validate data according transaction type: valid for payment', t => {
  const transactionData = {
    transactionType: 'payment',
    amount: 120.00,
    serviceType: 'Electricity'
  };
  const result = transactionsService.validateDataByTransactionType(transactionData);

  t.true(result, 'Expected valid data for payment');
});

test.skip('Validate data according transaction type: not valid for transfer', t => {
  const transactionData = {
    transactionType: 'transfer',
    amount: 120.00,
    account: {
      name: 'Juan Perez',
      accountNumber: '',
      phoneNumber: ''
    }
  };
  const result = transactionsService.validateDataByTransactionType(transactionData);

  t.false(result, 'Expected not valid data for transfer');
});

test.serial('Validate data according transaction type: valid for transfer', t => {
  const transactionData = {
    transactionType: 'transfer',
    amount: 120.00,
    account: {
      name: 'Juan Perez',
      accountNumber: '4646-2222-3455-3323',
      phoneNumber: '989988999'
    }
  };
  const result = transactionsService.validateDataByTransactionType(transactionData);

  t.true(result, 'Expected valid data for transfer');
});
