'use strict';

const test = require('ava');
const sinon = require('sinon');

const setupHeadquartersService = require('../../database/headquarters.service');

const collectionKey = 'headquarters';
let sandbox = null;
let dbInstanceStub = null;

let headquartersService;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  dbInstanceStub = {};
  dbInstanceStub.collection = sandbox.stub();
  dbInstanceStub.collection
    .withArgs(collectionKey)
    .returns({
      get: () => {
        return Promise.resolve([
          {
            id: 'aaaaaaaaaaa',
            data: () => {
              return {};
            }
          },
          {
            id: 'bbbbbbbbbb',
            data: () => {
              return {};
            }
          }
        ]);
      },
      doc: (docId) => {
        return {
          get: () => {
            return Promise.resolve({
              exists: true,
              data: () => {
                return {};
              }
            });
          }
        };
      }
    });

  headquartersService = setupHeadquartersService(dbInstanceStub);
});

test.afterEach(() => {

});

test.serial('Do list headquarters', async t => {
  let headquarterData = await headquartersService.doList();

  t.is(headquarterData.hasOwnProperty('data'), true, 'Expected data key');
  t.is(headquarterData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(headquarterData['data'].length, 2, 'Expected 2 elements');
});

test.serial('Get headquarter', async t => {
  let data = 'aaaaaaa';

  let headquarterData = await headquartersService.getHeadquarter(data);

  t.is(headquarterData.hasOwnProperty('data'), true, 'Expected data key');
  t.is(headquarterData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(headquarterData['data']['id'], data, 'Expected same value');
});
