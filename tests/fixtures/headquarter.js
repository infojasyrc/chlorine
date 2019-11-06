'use strict';

const uuidGenerator = require('uuid/v4');

class MockHeadquarter {
  constructor() {}

  static getBuenosAires() {
    return {
      id: 'SXd0Jb0kzzxERzI2S4hc',
      name: 'Buenos Aires'
    };
  }

  static getAll() {
    return [
      this.getBuenosAires()
    ];
  }
}

module.exports = MockHeadquarter;
