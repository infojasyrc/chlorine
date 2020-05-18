'use strict';

const test = require('ava');
const sinon = require('sinon');

const setupAuthenticationService = require('../../services/authentication.service');

let authenticationService;
let adminInstanceStub;
let sandbox = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  adminInstanceStub = {};

  adminInstanceStub.revokeRefreshTokens = sandbox.stub();
  adminInstanceStub.revokeRefreshTokens.returns(
    Promise.resolve({})
  );
  
  adminInstanceStub.getUser = sandbox.stub();
  adminInstanceStub.getUser.returns(
    Promise.resolve({
      tokensValidAfterTime: new Date().toISOString()
    })
  );
  
  adminInstanceStub.ref = sandbox.stub();
  adminInstanceStub.ref.returns(
    {
      set: () => {
        return Promise.resolve({});
      }
    }
  );
  
  adminInstanceStub.createUser = sandbox.stub();

});

test.afterEach(() => {
  sandbox && sandbox.restore();
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

  authenticationService = setupAuthenticationService(adminInstanceStub);

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

  authenticationService = setupAuthenticationService(adminInstanceStub);

  const result = await authenticationService.changePasswordUsingAdminSDK(
    userId,
    newPassword
  );

  t.is(result.hasOwnProperty('message'), true, 'Expected message key');
  t.is(result.hasOwnProperty('data'), true, 'Expected data key');
  t.is(result.hasOwnProperty('responseCode'), true, 'Expected data key');
  t.is(result['responseCode'], 500, 'Expected 500 error response');
});

test.serial('Revoke token', async t => {
  const userId = 'thisIsAUserId';
  
  authenticationService = setupAuthenticationService(adminInstanceStub);

  const authenticationResponse = await authenticationService.revokeToken(userId);

  t.is(authenticationResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(authenticationResponse.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Create authentication user: success response', async t => {
  const userData = {
    email: 'email@test.com',
    emailVerified: false,
    password: 'password',
    displayName: 'Juan Perez',
    disabled: false
  };

  adminInstanceStub.createUser.returns(
    Promise.resolve({uid: 'ThisIsAUserId'})
  );

  authenticationService = setupAuthenticationService(adminInstanceStub);

  const newAuthUserResponse = await authenticationService.createUser(userData);
  console.log(newAuthUserResponse);
  t.is(Object.prototype.hasOwnProperty.call(newAuthUserResponse, 'message'), true, 'Expected message key');
  t.is(Object.prototype.hasOwnProperty.call(newAuthUserResponse, 'data'), true, 'Expected data key');
  t.is(Object.prototype.hasOwnProperty.call(newAuthUserResponse['data'], 'uid'), true, 'Expected data key');
});
