'use strict'

const BaseController = require('../base.controller')
const serviceContainer = require('../../../services/service.container')

let baseController = new BaseController()
const headquartersService = serviceContainer('headquarters')

const get = async (request, response) => {
  let responseCode = 500
  let responseData

  try {
    const allData = await headquartersService.doList()
    responseCode = allData.responseCode
    responseData = baseController.getSuccessResponse(allData.data, allData.message)
  } catch (err) {
    const errorMessage = 'Error getting all headquarters'
    /* eslint-disable no-console */
    // console.error(errorMessage, err)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

module.exports = {
  get,
}
