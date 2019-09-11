'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');

let serviceContainer;

test.beforeEach(() => {
  const allServices = () => {
    // Add more functions per service according to the unit tests
    return {
      eventsService: {
        create: {},
        doList: {},
        findById: {}
      },
      authenticationService: {},
      attendeesService: {},
      headquartersService: {},
      rolesService: {},
      storageService: {},
      userService: {
        create: {}
      }
    };
  };

  serviceContainer = proxyquire('./../../database/service.container', {
    './': allServices
  });
});


test.serial('Check events service', t => {
  const eventService = serviceContainer('events');

  t.true(eventService.hasOwnProperty('create'), 'Expected create property');
});

test.serial('Check users service', t => {
  const userService = serviceContainer('users');

  t.true(userService.hasOwnProperty('create'), 'Expected create property');
});

test.serial('Not service found', t => {
  const error = t.throws(() => { serviceContainer('event'); }, Error);
  t.is(error.message, 'Invalid Service');
});
