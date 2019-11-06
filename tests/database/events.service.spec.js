'use strict';

const test = require('ava');
const sinon = require('sinon');

const mockFirestoreCollectionList = require('./../util/firestore.collection.list');

const setupEventsService = require('../../database/events.service');

let collectionKey = 'events';
let sandbox = null;
let eventsService;
let dbInstanceStub = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  dbInstanceStub = {};
  dbInstanceStub.collection = sandbox.stub();
  dbInstanceStub.collection
    .withArgs(collectionKey)
    .returns({
      get: () => {
        mockFirestoreCollectionList.get(collectionKey, 2);
      },
      doc: (path) => {
        return {
          get: () => {
            return Promise.resolve({
              exists: true,
              data: () => {
                return {
                  userId: '2',
                  name: '',
                  lastname: '',
                  isAdmin: false,
                  avatarUrl: ''
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
            return Promise.resolve({
              data
            });
          }
        };
      },
      add: (data) => {
        return Promise.resolve({
          id: 10000
        });
      }
    });

  eventsService = setupEventsService(dbInstanceStub);
});

test.afterEach(() => {
  // Restore sandbox
  sandbox && sandbox.restore();
});

test.serial('Create event', async t => {
  const data = {
    name: 'Juan Perez',
    date: 'Perez',
    headquarter: {
      id: 'aaaaaaa',
      name: 'Buenos Aires'
    },
    status: 'created',
    placeName: '',
    address: '120 Main Street',
    phoneNumber: '',
    responsable: {}
  };

  let newEvent = await eventsService.create(data);

  t.is(newEvent.hasOwnProperty('message'), true, 'Expected message key');
  t.is(newEvent.hasOwnProperty('data'), true, 'Expected data key');

  t.is(newEvent['data'].hasOwnProperty('id'), true, 'Expected id key');
  t.is(newEvent['data'].hasOwnProperty('name'), true, 'Expected name key');
  t.is(newEvent['data'].hasOwnProperty('date'), true, 'Expected date key');
  t.is(newEvent['data'].hasOwnProperty('headquarter'), true, 'Expected headquarter key');
  t.is(newEvent['data'].hasOwnProperty('status'), true, 'Expected status key');
  t.is(newEvent['data'].hasOwnProperty('placeName'), true, 'Expected placeName key');
  t.is(newEvent['data'].hasOwnProperty('address'), true, 'Expected address key');
  t.is(newEvent['data'].hasOwnProperty('responsable'), true, 'Expected responsable key');
});

test.serial('Do list all events without year and headquarter', async t => {
  let eventsData = await eventsService.doList({});

  t.is(eventsData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(eventsData.hasOwnProperty('data'), true, 'Expected data key');
  t.is(eventsData['data'].length, 0, 'Expected 0 elements');
});

test.skip('Do list all events with year and headquarter', async t => {
  const eventsParams = {
    year: '2019',
    headquarterId: 'aaaaaaa'
  };

  let eventsData = await eventsService.doList(eventsParams);

  t.is(eventsData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(eventsData.hasOwnProperty('data'), true, 'Expected data key');
  t.is(eventsData['data'].length, 2, 'Expected 2 elements');

  eventsData['data'].forEach((eventData) => {
    t.is(eventData.hasOwnProperty('id'), true, 'Expected id key');
    t.is(eventData.hasOwnProperty('name'), true, 'Expected name key');
    t.is(eventData.hasOwnProperty('date'), true, 'Expected date key');
    t.is(eventData.hasOwnProperty('headquarter'), true, 'Expected headquarter key');
    t.is(eventData.hasOwnProperty('placeName'), true, 'Expected placeName key');
    t.is(eventData.hasOwnProperty('address'), true, 'Expected address key');
    t.is(eventData.hasOwnProperty('responsable'), true, 'Expected responsable key');
    t.is(eventData.hasOwnProperty('status'), true, 'Expected status key');
  });
});

test.serial('Get event', async t => {
  const eventId = 'abcdefghi';

  let eventData = await eventsService.findById(eventId);

  t.is(eventData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(eventData.hasOwnProperty('data'), true, 'Expected data key');
  t.is(eventData['data'].hasOwnProperty('id'), true, 'Expected documentId key');
  t.is(eventData['data'].hasOwnProperty('name'), true, 'Expected name key');
  t.is(eventData['data'].hasOwnProperty('lastname'), true, 'Expected lastname key');
  t.is(eventData['data'].hasOwnProperty('avatarUrl'), true, 'Expected avatarUrl key');
  t.is(eventData['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key');
  t.is(eventData['data']['id'], eventId, 'Expected same document Id');
});

test.serial('Update event', async t => {
  const eventId = 1,
    data = {
      name: 'Hackatrix 2019',
      date: '2019-03-15T17:00:00.000',
      headquarter: {},
      placeName: '',
      status: 'created',
      responsable: {}
    };

  let updatedData = await eventsService.update(eventId, data);

  t.is(updatedData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(updatedData.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Update event deleting images', async t => {
  const eventId = 1,
    data = {
      name: 'Hackatrix 2019',
      date: '2019-03-15T17:00:00.000',
      headquarter: {},
      placeName: '',
      status: 'created',
      responsable: {},
      deletedImages: ['a5b3d252-79bf-4b88-8eb1-08e20f8a4ca3']
    };

  let updatedData = await eventsService.update(eventId, data);

  t.is(updatedData.hasOwnProperty('message'), true, 'Expected message key');
  t.is(updatedData.hasOwnProperty('data'), true, 'Expected data key');
});

test.skip('Add attendees', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN',
    attendees = [
      {
        name: 'Juan Perez'
      },
      {
        name: 'Andrew Garfield'
      }
    ];

  let addAttendeesResponse = await eventsService.addAttendees(eventId, attendees);

  t.is(addAttendeesResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(addAttendeesResponse.hasOwnProperty('data'), true, 'Expected data key');
});

test.serial('Delete event', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN';
  const deleteAttendeeResponse = await eventsService.remove(eventId);
  t.is(deleteAttendeeResponse.hasOwnProperty('message'), true, 'Expected message key');
  t.is(deleteAttendeeResponse.hasOwnProperty('data'), true, 'Expected data key');
});
