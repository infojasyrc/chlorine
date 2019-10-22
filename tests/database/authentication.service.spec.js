'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const setupAuthenticationService = proxyquire('./../../database/authentication.service', {
  './auth.codes.service': () => {
    return {
      addAuthCode: () => {
        return Promise.resolve({
          responseCode: 200,
          data: {
            code: 'thisIsACode',
            userId: 'thisIsAUserId'
          },
          message: '',
          status: true
        });
      }
    };
  }
});

let authenticationService;
let clientAdminInstanceStub;
let adminInstanceStub;
let dbInstanceStub;
let sandbox = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  clientAdminInstanceStub = {};
  adminInstanceStub = {};
  dbInstanceStub = {};

  clientAdminInstanceStub.signInWithEmailAndPassword = sandbox.stub();
  clientAdminInstanceStub
    .signInWithEmailAndPassword
    .returns(Promise.resolve({}));

  clientAdminInstanceStub.currentUser = {
    email: 'email@test.com'
  };
  clientAdminInstanceStub.currentUser.reauthenticateAndRetrieveDataWithCredential = sandbox.stub();
  clientAdminInstanceStub.currentUser
    .reauthenticateAndRetrieveDataWithCredential
    .returns(Promise.resolve({}));
  clientAdminInstanceStub.currentUser.getIdToken = sandbox.stub();
  clientAdminInstanceStub
    .currentUser.getIdToken
    .returns(Promise.resolve('this is an expected token'));
  clientAdminInstanceStub.currentUser.updatePassword = sandbox.stub();
  clientAdminInstanceStub
    .currentUser.updatePassword
    .returns(Promise.resolve({}));

  clientAdminInstanceStub.signOut = sandbox.stub();
  clientAdminInstanceStub
    .signOut
    .returns(Promise.resolve({}));

  clientAdminInstanceStub.EmailAuthProvider = {};
  clientAdminInstanceStub.EmailAuthProvider.credential = sandbox.stub();
  clientAdminInstanceStub
    .EmailAuthProvider.credential
    .returns({});

  clientAdminInstanceStub.sendPasswordResetEmail = sandbox.stub();
  clientAdminInstanceStub
    .sendPasswordResetEmail
    .returns(Promise.resolve({}));

});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test.serial('Login', async t => {
  const data = {
    email: 'test@gmail.com',
    password: 'password'
  };

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  let authenticationResponse = await authenticationService.login(data);

  t.is(authenticationResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(authenticationResponse.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Check credentials for login', async t => {
  const password = 'aaaaaaa';

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  let loginResult = await authenticationService.checkLogin(password);

  t.is(loginResult.data, true, 'Expected success result');
});

test.serial('Change login password', async t => {
  const password = 'bbbbbbb';

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  let processData = await authenticationService.changePassword(password);
  t.is(processData.data, true, 'Expected success result');
});

test.serial('Reset password', async t => {
  const emailTest = 'user@example.com';

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  const result = await authenticationService.resetPassword(emailTest);

  t.is(result.hasOwnProperty('message'), true, 'Expected message key');
  t.is(result.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Change password using admin sdk: success response', async t => {
  const userId = 'pmBhQP2XYWQsdPB5g45pasa4teasdaTwYzM3uH22';
  const newPassword = 'newPassword';

  adminInstanceStub.updateUser = sandbox.stub();
  adminInstanceStub
    .updateUser
    .returns(Promise.resolve({
      email: '',
      phoneNumber: '',
      emailVerified: true,
      password: '',
      displayName: '',
      photoURL: '',
      disabled: false
    }));

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  const result = await authenticationService.changePasswordUsingAdminSDK(
    userId,
    newPassword
  );

  t.is(result.hasOwnProperty('message'), true, 'Expected message key');
  t.is(result.hasOwnProperty('data'), true, 'Expected data key');
  t.is(result.hasOwnProperty('responseCode'), true, 'Expected data key');
  t.is(result['responseCode'], 200, 'Expected 500 error response');
});

test.serial('Change password using admin sdk: error response', async t => {
  const userId = 'pmBhQP2XYWQsdPB5g45pasa4teasdaTwYzM3uH22';
  const newPassword = 'newPassword';

  adminInstanceStub.updateUser = sandbox.stub();
  adminInstanceStub
    .updateUser
    .returns(Promise.reject({}));

  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  const result = await authenticationService.changePasswordUsingAdminSDK(
    userId,
    newPassword
  );

  t.is(result.hasOwnProperty('message'), true, 'Expected message key');
  t.is(result.hasOwnProperty('data'), true, 'Expected data key');
  t.is(result.hasOwnProperty('responseCode'), true, 'Expected data key');
  t.is(result['responseCode'], 500, 'Expected 500 error response');
});

test.serial('Logout', async t => {
  authenticationService = setupAuthenticationService(
    clientAdminInstanceStub,
    adminInstanceStub,
    dbInstanceStub
  );

  const authenticationResponse = await authenticationService.logout();

  t.is(authenticationResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(authenticationResponse.hasOwnProperty('data'), true, 'Expected data key');
});
