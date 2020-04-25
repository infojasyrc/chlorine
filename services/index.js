'use strict';

const setupServiceProviders = require('./../providers');

const setupUserService = require('./user.service');
const setupAttendeesService = require('./attendees.service');
const setupEventsService = require('./events.service');
const setupAuthenticationService = require('./authentication.service');
const setupRolesService = require('./roles.service');
const setupHeadquartersService = require('./headquarters.service');
const setupStorageService = require('./storage.service');
const setupAccountsService = require('./accounts.service');
const setupSessionService = require('./session.service');
const setupTransactionsService = require('./transactions.service');
const setupAuthCodeService = require('./auth.codes.service');

module.exports = () => {
  const serviceProviders = setupServiceProviders();
  
  const authenticationService = setupAuthenticationService(serviceProviders.adminAuth);
  const userService = setupUserService(serviceProviders.adminAuth, serviceProviders.dbInstance);
  const attendeesService = setupAttendeesService(serviceProviders.dbInstance);
  const eventsService = setupEventsService(serviceProviders.dbInstance);
  const rolesService = setupRolesService(serviceProviders.dbInstance);
  const headquartersService = setupHeadquartersService(serviceProviders.dbInstance);
  const storageService = setupStorageService(serviceProviders.bucket);
  const accountsService = setupAccountsService(serviceProviders.dbInstance);
  const sessionService = setupSessionService(serviceProviders.adminAuth);
  const transactionsService = setupTransactionsService(serviceProviders.dbInstance);
  const authCodesService = setupAuthCodeService(serviceProviders.adminAuth, serviceProviders.dbInstance);

  return {
    authCodesService,
    authenticationService,
    accountsService,
    attendeesService,
    eventsService,
    headquartersService,
    rolesService,
    storageService,
    userService,
    sessionService,
    transactionsService
  };
};
