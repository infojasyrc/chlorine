'use strict';

const setupBaseController = require('./../base.controller');
const setupDBService = require('./../../../database');

let baseController = new setupBaseController();
const dbService = setupDBService();

const get = async (request, response) => {
  const eventParameters = {};
  let responseCode;
  let responseData;

  if (!request.params.headquarterId) {
    return response
      .status(400)
      .json(baseController.getErrorResponse('No Headquarter provided'));
  }

  eventParameters.year = !request.params.year ?
    new Date().getFullYear() : request.params.year;

  eventParameters.headquarterId = request.params.headquarterId;

  eventParameters.showAll = !request.params.showAll ?
    false : request.params.showAll === "true";

  eventParameters.withAttendees = !request.params.withAttendees ?
    false : request.params.withAttendees === "true";

  try {
    const events = await dbService.eventsService.doList(eventParameters);

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
