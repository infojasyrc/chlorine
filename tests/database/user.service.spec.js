'use strict';

const test = require('ava');
const sinon = require('sinon');

const firebaseAdminMock = require('./../fixtures/admin.firebase.mock');
const setupUserService = require('../../database/user.service');

let sandbox = null;
let userService;
let adminInstanceStub = null;
let dbInstanceStub = null;
let collectionKey = 'users';

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  adminInstanceStub = firebaseAdminMock;

  dbInstanceStub = {};
  dbInstanceStub.collection = sandbox.stub();
  dbInstanceStub
    .collection
    .withArgs(collectionKey)
    .returns({
      get: () => {
        return Promise.resolve([
          {
            id: 'aaaaaaaaaaaaaaaa',
            data: () => {
              return {
                userId: '1',
                email: 'test01@email.com',
                name: '',
                lastName: '',
                isAdmin: true,
                isEnabled: true,
                avatarUrl: '',
                role: {
                  id: '1',
                  name: 'Marketing'
                }
              };
            }
          }, {
            id: 'bbbbbbbbbbbbbbb',
            data: () => {
              return {
                userId: '2',
                email: 'test02@email.com',
                name: '',
                lastName: '',
                isAdmin: false,
                isEnabled: true,
                avatarUrl: '',
                role: {
                  id: '2',
                  name: 'Human Resources'
                }
              };
            }
          }
        ]);
      },
      doc: (path) => {
        return {
          get: () => {
            return Promise.resolve({
              exists: true,
              data: () => {
                return {
                  userId: '2',
                  email: 'test@email.com',
                  name: '',
                  lastName: '',
                  isAdmin: false,
                  isEnabled: true,
                  avatarUrl: '',
                  role: {
                    id: '1',
                    name: 'Marketing'
                  }
                };
              }
            });
          },
          delete: () => {
            return {};
          },
          set: (data) => {
            return {};
          },
          update: (data) => {
            return Promise.resolve({data});
          }
        };
      },
      add: (data) => {
        return Promise.resolve({id: 10000});
      }
    });

  userService = setupUserService(adminInstanceStub, dbInstanceStub);
});

test.afterEach(() => {
  // Restore sandbox
  sandbox && sandbox.restore();
  userService = null;
});

test.serial('Create user', async t => {
  const data = {
    email: 'test@test.com',
    password: '',
    name: 'Juan',
    lastName: 'Perez',
    isAdmin: true,
    role: {
      id: '1',
      name: 'Marketing'
    }
  };

  let newUser = await userService.create(data);

  t.is(newUser.hasOwnProperty('message'), true, 'Expected message key');
  t.is(newUser.hasOwnProperty('data'), true, 'Expected data key');

  t.is(newUser['data'].hasOwnProperty('userId'), true, 'Expected userId key');
  t.is(newUser['data'].hasOwnProperty('id'), true, 'Expected id key');
  t.is(newUser['data'].hasOwnProperty('email'), true, 'Expected email key');
  t.is(newUser['data'].hasOwnProperty('name'), true, 'Expected name key');
  t.is(newUser['data'].hasOwnProperty('lastName'), true, 'Expected lastName key');
  t.is(newUser['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key');
  t.is(newUser['data'].hasOwnProperty('avatarUrl'), true, 'Expected avatarUrl key');
  t.is(newUser['data'].hasOwnProperty('isEnabled'), true, 'Expected isEnabled key');
  t.is(newUser['data'].hasOwnProperty('role'), true, 'Expected role key');
});

test.serial('Do list all users', async t => {
  let allUsers = await userService.doList();

  t.is(allUsers.hasOwnProperty('message'), true, 'Expected message key');
  t.is(allUsers.hasOwnProperty('data'), true, 'Expected data key');

  t.is(allUsers['data'].length, 2, 'Expected 2 elements');

  allUsers['data'].forEach((userData) => {
    t.is(userData.hasOwnProperty('id'), true, 'Expected id key');
    t.is(userData.hasOwnProperty('userId'), true, 'Expected userId key');
    t.is(userData.hasOwnProperty('name'), true, 'Expected name key');
    t.is(userData.hasOwnProperty('lastName'), true, 'Expected lastName key');
    t.is(userData.hasOwnProperty('isAdmin'), true, 'Expected isAdmin key');
    t.is(userData.hasOwnProperty('role'), true, 'Expected role key');
  });
});

test.serial('Get user', async t => {
  const docUserId = 'abcdefghi';

  let userInfo = await userService.findById(docUserId);

  t.is(userInfo.hasOwnProperty('message'), true, 'Expected message key');
  t.is(userInfo.hasOwnProperty('data'), true, 'Expected data key');

  t.is(userInfo['data'].hasOwnProperty('userId'), true, 'Expected uid key');
  t.is(userInfo['data'].hasOwnProperty('id'), true, 'Expected id key');
  t.is(userInfo['data'].hasOwnProperty('name'), true, 'Expected name key');
  t.is(userInfo['data'].hasOwnProperty('lastName'), true, 'Expected lastname key');
  t.is(userInfo['data'].hasOwnProperty('avatarUrl'), true, 'Expected avatarUrl key');
  t.is(userInfo['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key');
  t.is(userInfo['data'].hasOwnProperty('isEnabled'), true, 'Expected isEnabled key');
  t.is(userInfo['data'].hasOwnProperty('role'), true, 'Expected role key');
});

test.serial('Update user', async t => {
  const userId = 1,
    data = {
      name: 'Juan',
      lastname: 'Perez',
      isAdmin: true,
      avatarUrl: ''
    };

  let updatedUser = await userService.update(userId, data);

  t.is(updatedUser.hasOwnProperty('message'), true, 'Expected message key');
  t.is(updatedUser.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Delete user', async t => {
  const userId = 1;

  let data = await userService.toggleEnable(userId);

  t.is(data.hasOwnProperty('message'), true, 'Expected message attribute');
});
