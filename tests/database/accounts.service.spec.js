'use strict';

const test = require('ava');
const sinon = require('sinon');

const setupAccountsService = require('./../../database/accounts.service');

const collectionKey = 'accounts';
let sandbox = null;
let dbInstanceStub = {};
let accountsService;
const userId = 'thisIsAUserId';

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  dbInstanceStub.collection = sandbox.stub();
  dbInstanceStub.collection
    .withArgs(collectionKey)
    .returns({
      where: () => {
        return {
          get: () => {
            return Promise.resolve(
              [{
                  id: 'aaaaaa',
                  data: () => {
                    return {
                      name: 'Cuenta Corriente',
                      balance: 20000000.88,
                      userId: userId
                    };
                  }
                },
                {
                  id: 'bbbbbbbbb',
                  data: () => {
                    return {
                      name: 'Cuenta Ahorros',
                      balance: 20000000.88,
                      userId: userId
                    };
                  }
                }
              ]
            );
          }
        }
      }
    });

  accountsService = setupAccountsService(dbInstanceStub);
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test.serial('Check balance', async t => {
  const userBalance = await accountsService.checkBalance(userId);

  t.true(userBalance.hasOwnProperty('message'), 'Expected message key');
  t.true(userBalance.hasOwnProperty('data'), 'Expected data key');
  t.true(userBalance.data > 0, 'Expected a balance greater than 0');
});

test.serial('Get all accounts', async t => {
  const allAccounts = await accountsService.getAll(userId);

  t.true(allAccounts.hasOwnProperty('message'), 'Expected message key');
  t.true(allAccounts.hasOwnProperty('data'), 'Expected data key');
  t.true(allAccounts.data.length > 0, 'Expected accounts in data');
});

