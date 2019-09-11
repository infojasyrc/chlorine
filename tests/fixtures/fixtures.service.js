'use strict';

const EventFixture = require('./event')

class FixtureService {
  constructor() {}

  static getFixture(fixtureType) {
    switch(fixtureType) {
      case 'events':
      default:
        return EventFixture;
    }
  }
}

module.exports = FixtureService;
