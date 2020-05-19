'use strict';

const setupBaseController = require('../base.controller');
const serviceContainer = require('../../../../services/service.container');

let baseController = new setupBaseController();
const eventsService = serviceContainer('events');

const get = async (request, response) => {
  const eventParameters = {};
  let responseCode;
  let responseData;

  eventParameters.year = !request.query.year ?
    new Date().getFullYear(): request.query.year;

  eventParameters.headquarterId = !request.query.headquarterId ?
    null : request.query.headquarterId;

  eventParameters.showAll = !request.query.showAll ?
    false : request.query.showAll === 'true';

  eventParameters.withAttendees = !request.query.withAttendees ?
    false : request.query.withAttendees === 'true';

  try {
    const events = await eventsService.doList(eventParameters);

    responseCode = events.responseCode;
    responseData = baseController.getSuccessResponse(events.data, events.message);
  } catch (error) {
    console.error('Error while listing events', error);
    responseCode = 500;
    responseData = baseController.getErrorResponse('Error while listing events');
  }

  return response.status(responseCode).json(responseData);
};

module.exports = { get };
