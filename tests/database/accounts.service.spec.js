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
                      salda: 20000000.88,
                      userId: userId
                    };
                  }
                },
                {
                  id: 'bbbbbbbbb',
                  data: () => {
                    return {
                      name: 'Cuenta Ahorros',
                      salda: 20000000.88,
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

  t.is(userBalance.hasOwnProperty('message'), true, 'Expected message key');
  t.is(userBalance.hasOwnProperty('data'), true, 'Expected data key');
});

