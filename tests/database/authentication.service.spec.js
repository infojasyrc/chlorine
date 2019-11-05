'use strict';

const test = require('ava');
const sinon = require('sinon');

const setupAuthenticationService = require('./../../database/authentication.service');

let authenticationService;
let clientInstanceStub;
let adminInstanceStub;
let sandbox = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  clientInstanceStub = {};
  adminInstanceStub = {};

  adminInstanceStub.revokeRefreshTokens = sandbox.stub();
  adminInstanceStub.revokeRefreshTokens
    .returns(Promise.resolve({}));
  adminInstanceStub.getUser = sandbox.stub();
  adminInstanceStub.getUser
    .returns(Promise.resolve({
      tokensValidAfterTime: new Date().toISOString()
    }));
  adminInstanceStub.ref = sandbox.stub();
  adminInstanceStub.ref
    .returns({
      set: () => {
        return Promise.resolve({});
      }
    });

  clientInstanceStub.signInWithEmailAndPassword = sandbox.stub();
  clientInstanceStub
    .signInWithEmailAndPassword
    .returns(Promise.resolve({}));

  clientInstanceStub.currentUser = {
    email: 'email@test.com'
  };
  clientInstanceStub.currentUser.reauthenticateAndRetrieveDataWithCredential = sandbox.stub();
  clientInstanceStub.currentUser
    .reauthenticateAndRetrieveDataWithCredential
    .returns(Promise.resolve({}));
  clientInstanceStub.currentUser.getIdToken = sandbox.stub();
  clientInstanceStub
    .currentUser.getIdToken
    .returns(Promise.resolve('this is an expected token'));
  clientInstanceStub.currentUser.updatePassword = sandbox.stub();
  clientInstanceStub
    .currentUser.updatePassword
    .returns(Promise.resolve({}));

  clientInstanceStub.signOut = sandbox.stub();
  clientInstanceStub
    .signOut
    .returns(Promise.resolve({}));

  clientInstanceStub.EmailAuthProvider = {};
  clientInstanceStub.EmailAuthProvider.credential = sandbox.stub();
  clientInstanceStub
    .EmailAuthProvider.credential
    .returns({});

  clientInstanceStub.sendPasswordResetEmail = sandbox.stub();
  clientInstanceStub
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
    clientInstanceStub,
    adminInstanceStub
  );

  let authenticationResponse = await authenticationService.login(data);

  t.is(authenticationResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(authenticationResponse.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Check credentials for login', async t => {
  const password = 'aaaaaaa';

  authenticationService = setupAuthenticationService(
    clientInstanceStub,
    adminInstanceStub
  );

  let loginResult = await authenticationService.checkLogin(password);

  t.is(loginResult.data, true, 'Expected success result');
});

test.serial('Change login password', async t => {
  const password = 'bbbbbbb';

  authenticationService = setupAuthenticationService(
    clientInstanceStub,
    adminInstanceStub
  );

  let processData = await authenticationService.changePassword(password);
  t.is(processData.data, true, 'Expected success result');
});

test.serial('Reset password', async t => {
  const emailTest = 'user@example.com';

  authenticationService = setupAuthenticationService(
    clientInstanceStub,
    adminInstanceStub
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
    clientInstanceStub,
    adminInstanceStub
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
  adminInstanceStub.updateUser.returns(Promise.reject({}));

  authenticationService = setupAuthenticationService(
    clientInstanceStub,
    adminInstanceStub
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
  const userId = 'thisIsAUserId';
  authenticationService = setupAuthenticationService(
    clientInstanceStub,
    adminInstanceStub
  );

  const authenticationResponse = await authenticationService.logout(userId);

  t.is(authenticationResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(authenticationResponse.hasOwnProperty('data'), true, 'Expected data key');
});
