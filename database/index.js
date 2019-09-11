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

module.exports = function () {

  const firebase = setupFirebaseApplication();
  const adminApp = setupFirebaseAdminApplication();

  const authenticationService = setupAuthenticationService(firebase.auth(), adminApp.auth());
  const userService = setupUserService(adminApp.auth(), adminApp.firestore());
  const attendeesService = setupAttendeesService(adminApp.firestore());
  const eventsService = setupEventsService(adminApp.firestore());
  const rolesService = setupRolesService(adminApp.firestore());
  const headquartersService = setupHeadquartersService(adminApp.firestore());
  const storageService = setupStorageService(adminApp.storage().bucket());

  return {
    authenticationService,
    attendeesService,
    eventsService,
    headquartersService,
    rolesService,
    storageService,
    userService
  };
};
