'use strict';

const setupDBService = require('./');

module.exports = function getContainer(service) {
  const dbService = setupDBService();

  if (service === 'events') {
    return dbService.eventsService;
  }

  if (service === 'authentication') {
    return dbService.authenticationService;
  }

  if (service === 'attendees') {
    return dbService.attendeesService;
  }

  if (service === 'headquarters') {
    return dbService.headquartersService;
  }

  if (service === 'roles') {
    return dbService.rolesService;
  }

  if (service === 'storage') {
    return dbService.storageService;
  }

  if (service === 'users') {
    return dbService.userService;
  }

  if (service === 'accounts') {
    return dbService.accountsService;
  }

  if (service === 'session') {
    return dbService.sessionService;
  }

  if (service === 'transactions') {
    return dbService.transactionsService;
  }

  if (service === 'authCode') {
    return dbService.authCodesService;
  }

  throw new Error('Invalid Service');
};
