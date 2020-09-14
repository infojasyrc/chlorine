'use strict'

const BaseController = require('../base.controller')
const serviceContainer = require('../../../services/service.container')

const baseController = new BaseController()
const transactionsService = serviceContainer('transactions')
const sessionService = serviceContainer('session')

let responseCode
let responseData

const submitTransaction = async (request, response) => {
  if (!request.body.transactionType || !request.body.amount) {
    return response.status(400).json(baseController.getErrorResponse('Parameters are missing'))
  }
  // Access forbidden
  if (!baseController.isTokenInHeader(request)) {
    return response.status(403).json(baseController.getErrorResponse('No session information'))
  }

  if (!transactionsService.validateDataByTransactionType(request.body)) {
    return response.status(400).json(baseController.getErrorResponse('Parameters are missing'))
  }

  try {
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization)

    if (!sessionInfo.data) {
      responseCode = sessionInfo.responseCode
      responseData = baseController.getErrorResponse(sessionInfo.message)
      return response.status(responseCode).json(responseData)
    }

    const transactionData = transactionsService.formatTransactionDataFromRequest(request.body)

    const transactionResponse = await transactionsService.makeTransaction(
      sessionInfo.data,
      transactionData
    )

    if (transactionResponse.responseCode !== 200) {
      responseCode = transactionResponse.responseCode
      responseData = baseController.getErrorResponse(transactionResponse.message)
      return response.status(responseCode).json(responseData)
    }

    responseCode = transactionResponse.responseCode
    responseData = baseController.getSuccessResponse(
      transactionResponse.data,
      transactionResponse.message
    )
  } catch (err) {
    const errorMessage = 'Error on submitting a transaction'
    console.error(errorMessage, err)
    responseCode = 500
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

const resetTransactionsPerUser = async (request, response) => {
  if (!baseController.isTokenInHeader(request)) {
    return response.status(403).json(baseController.getErrorResponse('No session information'))
  }

  try {
    const sessionInfo = await sessionService.getUserSession(request.headers.authorization)

    if (!sessionInfo.data) {
      responseCode = sessionInfo.responseCode
      responseData = baseController.getErrorResponse(sessionInfo.message)
      return response.status(responseCode).json(responseData)
    }

    const response = transactionsService.deleteTransactions(sessionInfo.data)

    responseCode = response.responseCode
    responseData = response.data
  } catch (err) {
    const errorMessage = 'Error removing transactions per user'
    console.error(errorMessage, err)
  }

  return response.status(responseCode).json(responseData)
}

module.exports = {
  submitTransaction,
  resetTransactionsPerUser,
}
