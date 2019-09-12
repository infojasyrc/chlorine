'use strict';

const setupBaseController = require('./../base.controller');
const setupDBService = require('./../../../database');

let baseController = new setupBaseController();
const dbService = setupDBService();

const get = async (request, response) => {
  let year = new Date().getFullYear();
  let headquarterId = '';
  let showAll = true;

  if (request.params.year) {
    year = request.params.year;
  }

  if (request.params.headquarterId) {
    headquarterId = request.params.headquarterId;
  }

  if (request.params.showAll) {
    showAll = request.params.showAll === "true";
  }

  if (!headquarterId) {
    return response
      .status(400)
      .json(baseController.getErrorResponse('No Headquarter provided'));
  }

  try {
    let events = await dbService
      .eventsService
      .doList(year, false, headquarterId, showAll);

    return response
      .status(events.responseCode)
      .json(baseController.getSuccessResponse(events.data, events.message));
  } catch (error) {
    console.error('Error while listing events', error);
    return response
      .status(500)
      .json(baseController.getErrorResponse('Error while listing events'));
  }
};

const getWithAttendees = async (request, response) => {
  let year = new Date().getFullYear();

  if (request.params.year) {
    year = request.params.year;
  }

  try {
    let events = await dbService.eventsService.doList(year, true);

    return response
      .status(events.responseCode)
      .json(baseController.getSuccessResponse(events.data, events.message));
  } catch (error) {
    console.error('Error while listing events', error);
    return response
      .status(500)
      .json(baseController.getErrorResponse('Error while listing events'));
  }
};

module.exports = {
  get,
  getWithAttendees
};
