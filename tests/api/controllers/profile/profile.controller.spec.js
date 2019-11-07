'use strict';

const test = require('ava');
const sinon = require('sinon');
const { mockRequest, mockResponse } = require('mock-req-res');
const proxyquire = require('proxyquire');

test.beforeEach(() => {});
test.afterEach(() => {});

const getController = () => {
  return proxyquire('./../../../../api/controllers/profile/profile.controller', {
    './../../../services/service.container': (service) => {
      switch (service) {
        case 'session':
          return {
            getUserSession: () => {
              return Promise.resolve({
                responseCode: 200,
                message: 'Success',
                data: {}
              });
            }
          };
        case 'users':
          return {};
      }
    }
  });
};

test.serial('Get user profile: error for missing token', async t => {
  const request = mockRequest({
    params: {},
    body: {},
    headers: {}
  });
  const response = mockResponse();

  const profileController = getController();

  await profileController.get(request, response);

  t.true(response.status.called, 'Expected response status was executed');
  t.true(response.status.calledWith(403), 'Expected response status with success response');
  t.true(response.json.called, 'Expected response json was executed');
});

test.serial('Get user profile: success response', async t => {
  const request = mockRequest({
    params: {},
    body: {},
    headers: {
      authorization: 'thisIsATokenId'
    }
  });
  const response = mockResponse();

  const profileController = getController();

  await profileController.get(request, response);

  t.true(response.status.called, 'Expected response status was executed');
  t.true(response.status.calledWith(200), 'Expected response status with success response');
  t.true(response.json.called, 'Expected response json was executed');
});