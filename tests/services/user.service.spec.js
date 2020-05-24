'use strict';

const test = require('ava');
const sinon = require('sinon');

const setupUserService = require('../../services/user.service');

let sandbox = null;
let userService;
let dbInstanceStub = null;
let collectionKey = 'users';

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

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

  userService = setupUserService(dbInstanceStub);
});

test.afterEach(() => {
  // Restore sandbox
  sandbox && sandbox.restore();
  userService = null;
});

test.serial('Create user: success response', async t => {
  const userData = {
    name: 'Juan',
    lastName: 'Perez',
    email: 'test@email.com',
    isAdmin: true,
    isEnabled: true,
    uid: 'ThisIsAUserUID'
  };

  let newUser = await userService.create(userData);

  t.is(Object.prototype.hasOwnProperty.call(newUser, 'message'), true, 'Expected message key');
  t.is(Object.prototype.hasOwnProperty.call(newUser, 'data'), true, 'Expected data key');

  t.is(newUser['data'].hasOwnProperty('uid'), true, 'Expected userId key');
  t.is(newUser['data'].hasOwnProperty('id'), true, 'Expected id key');
  t.is(newUser['data'].hasOwnProperty('email'), true, 'Expected email key');
  t.is(newUser['data'].hasOwnProperty('name'), true, 'Expected name key');
  t.is(newUser['data'].hasOwnProperty('lastName'), true, 'Expected lastName key');
  t.is(newUser['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key');
  t.is(newUser['data'].hasOwnProperty('isEnabled'), true, 'Expected isEnabled key');
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
