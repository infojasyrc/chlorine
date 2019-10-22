'use strict';

const setupFirebaseApplication = require('./firebase.application');
const setupFirebaseAdminApplication = require('./firebase-admin.application');

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

module.exports = function () {

  const firebase = setupFirebaseApplication();
  const adminApp = setupFirebaseAdminApplication();

  const authenticationService = setupAuthenticationService(
    firebase.auth(),
    adminApp.auth(),
    adminApp.firestore()
  );
  const userService = setupUserService(adminApp.auth(), adminApp.firestore());
  const attendeesService = setupAttendeesService(adminApp.firestore());
  const eventsService = setupEventsService(adminApp.firestore());
  const rolesService = setupRolesService(adminApp.firestore());
  const headquartersService = setupHeadquartersService(adminApp.firestore());
  const storageService = setupStorageService(adminApp.storage().bucket());
  const accountsService = setupAccountsService(adminApp.firestore());
  const sessionService = setupSessionService(adminApp.auth());
  const transactionsService = setupTransactionsService(adminApp.firestore());
  const authCodesService = setupAuthCodeService(adminApp.auth(), adminApp.firestore());

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
