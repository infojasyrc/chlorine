'use strict'

const UserAuthentication = require('./../models/user-authentication')

const setupBaseService = require('./base.service')

module.exports = adminInstance => {
  const adminAuth = adminInstance
  const baseService = new setupBaseService()

  const updateUser = async (userId, userData) => {
    let response

    try {
      const updateResponse = await adminAuth.updateUser(userId, userData)

      const successMessage = 'User information updated successfully'
      response = baseService.getSuccessResponse(updateResponse, successMessage)
    } catch (err) {
      const errorMessage = 'Error updating user'
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = baseService.getErrorResponse(errorMessage)
    }

    return response
  }

  const changePasswordUsingAdminSDK = async (userId, newPassword) => {
    return await updateUser(userId, {
      password: newPassword,
    })
  }

  /**
   * Enable or Disable user
   * @param {String} userId
   * @param {Boolean} availability
   */
  const changeAvailability = async (userId, availability) => {
    return await updateUser(userId, {
      disabled: availability,
    })
  }

  /**
   * Create an authentication user
   * @param {Object} userData
   * @returns {Object}
   */
  const createUser = async userData => {
    let response

    try {
      const authResponse = await adminAuth.createUser(userData)
      const successMessage = 'Authentication created successfully'
      response = baseService.getSuccessResponse({ ...authResponse }, successMessage)
    } catch (error) {
      const errorMessage = !error.errorInfo ? 'Error creating user auth' : error.errorInfo.message
      console.error('Error creating user auth', !error.errorInfo ? error : error.errorInfo)
      response = baseService.getErrorResponse(errorMessage)
    }

    return response
  }

  const getModel = data => {
    return new UserAuthentication(data)
  }

  const revokeToken = async userId => {
    try {
      await adminInstance.revokeRefreshTokens(userId)
      const userRecord = await adminAuth.getUser(userId)
      const revokeTimeStamp = new Date(userRecord.tokensValidAfterTime).getTime() / 1000

      baseService.returnData.message = 'Sign out successfully'
      baseService.returnData.data = { revokeTimeStamp }
    } catch (err) {
      console.error('Error sign out: ', err)
      baseService.returnData.message = 'Error sign out'
      baseService.returnData.responseCode = 500
    }

    return baseService.returnData
  }

  const verifyToken = async token => {
    let responseData = {
      verified: false,
    }

    try {
      const currentToken = await adminAuth.verifyIdToken(token)

      if (!currentToken) {
        return {
          message: 'Unverified Token',
          data: responseData,
        }
      }

      baseService.returnData.message = 'Successfully verified Token'
      responseData.verified = true
    } catch (error) {
      console.error('Error while verifying token id', error)
      baseService.returnData.message = 'Error while verifying token id'
      baseService.returnData.responseCode = 500
    } finally {
      baseService.returnData.data = responseData
    }

    return baseService.returnData
  }

  return {
    changeAvailability,
    changePasswordUsingAdminSDK,
    createUser,
    getModel,
    revokeToken,
    verifyToken,
  }
}
