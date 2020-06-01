'use strict';

const setupBaseService = require('./base.service');
const User = require('./../models/user');

module.exports = dbInstance => {

  const collection = dbInstance.collection('users');

  let baseService = new setupBaseService();

  /**
   * Create user document
   * @param {Object} userData 
   */
  const create = async userData => {
    let response;
    const newUserData = {
      ...userData
    };

    try {
      const newUserDoc = await collection.add(newUserData);
      newUserData.id = newUserDoc.id;
      const successMessage = 'User was successfully created';

      response = baseService.getSuccessResponse(newUserData, successMessage);
    } catch (error) {
      const errorMessage = 'Error creating user document';
      console.error(errorMessage, error);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  const doList = async () => {
    let allUsers = [];
    let response;

    try {
      let userRefSnapshot = await collection.get();

      userRefSnapshot.forEach((doc) => {
        let userData = doc.data();
        userData.id = doc.id;
        allUsers.push(userData);
      });

      const successMessage = 'Getting all user list information successfully.';
      response = baseService.getSuccessResponse(allUsers, successMessage);
    } catch (err) {
      const errorMessage = 'Error getting user list information';
      console.error(errorMessage, err);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  const findById = async id => {
    let response;

    try {
      const userRefSnapshot = await collection.doc(id).get();

      if (!userRefSnapshot.exists) {
        return baseService.getSuccessResponse({}, 'No existing data');
      }
      const user = {
        ...userRefSnapshot.data(),
        id: id
      };

      const successMessage = 'Getting user information successfully';
      response = baseService.getSuccessResponse(user, successMessage);
    } catch (err) {
      const errorMessage = 'Error getting user information';
      console.error(errorMessage, err);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  const findByUserId = async userId => {
    let user = null;
    let response;

    try {
      let userRefSnapshot = await collection
        .where('uid', '==', userId)
        .limit(1)
        .get();

      if (userRefSnapshot.docs.length === 1) {
        user = userRefSnapshot.docs[0].data();
        user.id = userRefSnapshot.docs[0].id;
      }

      const successMessage = 'Getting user information successfully';
      response = baseService.getSuccessResponse(user, successMessage);
    } catch (err) {
      const errorMessage = 'Error getting user information';
      console.error(errorMessage, err);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  /**
   * Get user model
   * @param {Object} data
   */
  const getModel = data => {
    return new User(data);
  };

  /**
   * Disable user for removing operation
   * @param {String} id
   */
  const toggleEnable = async id => {
    let response;
    try {
      const userInfoRef = await collection.doc(id).get();

      const userData = userInfoRef.data();
      userData.isEnabled = !userData.isEnabled;

      await collection.doc(id).update({
        isEnabled: userData.isEnabled
      });

      const successMessage = 'User was disabled successfully';
      response = baseService.getSuccessResponse(userData, successMessage);

    } catch (err) {
      const errorMessage = 'Error removing a user';
      console.error(errorMessage, err);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  const update = async (userId, userData) => {
    let userResponse = null;
    let response;

    try {
      await collection.doc(userId).update(userData);

      let userInfoRef = await collection.doc(userId).get();
      userResponse = {
        ...userInfoRef.data(),
        id: userId
      };

      const successMessage = 'User was updated successfully';
      response = baseService.getSuccessResponse(userResponse, successMessage);
    } catch (err) {
      const errorMessage = 'Error updating a user';
      console.error('Error updating a user: ', err);
      response = baseService.getErrorResponse(errorMessage);
    }

    return response;
  };

  return {
    create,
    doList,
    findById,
    findByUserId,
    getModel,
    toggleEnable,
    update
  };
};
