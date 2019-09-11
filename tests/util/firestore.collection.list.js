'use strict';

const uuidGenerator = require('uuid/v4');

const MockFirestoreCollectionListElement = require('./firestore.collection.list.element');
const FixtureService = require('./../fixtures/fixtures.service');

class MockFirestoreCollectionList {
  constructor() {}

  static get(mockFixtureData, numberOfElements) {
    const fixtureData = FixtureService.getFixture(mockFixtureData);
    const allData = [];

    for (let i=0; i<numberOfElements; i++) {
      let uid = uuidGenerator();
      allData.push(
        MockFirestoreCollectionListElement.getElement(uid, fixtureData.generate)
      );
    }

    return Promise.resolve(allData);
  }
}

module.exports = MockFirestoreCollectionList;
