'use strict';

const setupBaseService = require('./base.service');

module.exports = dbInstance => {

  const collection = dbInstance.collection('users');

  let baseService = new setupBaseService();

  /**
   * Create user document
   * @param {Object} userData 
   * @param {String|null} uid 
   */
  const create = async (userData, uid = null) => {
    let response;
    const newUserData = {
      ...userData,
      userId: uid
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

    try {
      let userRefSnapshot = await collection.get();

      userRefSnapshot.forEach((doc) => {
        let userData = doc.data();
        userData.id = doc.id;
        allUsers.push(userData);
      });

      baseService.returnData.message = 'Getting all user list information successfully.';
    } catch (err) {
      console.error('Error getting documents', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error getting user list information';
    } finally {
      baseService.returnData.data = allUsers;
    }

    return baseService.returnData;
  };

  const findById = async id => {
    let user = null;

    try {
      let userRefSnapshot = await collection.doc(id).get();

      if (userRefSnapshot.exists) {
        user = userRefSnapshot.data();
      }

      user.id = id;
      baseService.returnData.message = 'Getting user information successfully';
    } catch (err) {
      console.error('Error getting user information', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error getting user information';
    } finally {
      baseService.returnData.data = user;
    }

    return baseService.returnData;
  };

  const findByUserId = async userId => {
    let user = null;

    try {
      let userRefSnapshot = await collection
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (userRefSnapshot.docs.length === 1) {
        user = userRefSnapshot.docs[0].data();
        user.id = userRefSnapshot.docs[0].id;
      }

      baseService.returnData.status = true;
      baseService.returnData.responseCode = 200;
      baseService.returnData.message = 'Getting user information successfully';
    } catch (err) {
      console.error('Error getting user information', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error getting user information';
    }

    baseService.returnData.data = user;

    return baseService.returnData;
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

    try {
      await collection.doc(userId).update(userData);

      let userInfoRef = await collection.doc(userId).get();
      userResponse = {
        ...userInfoRef.data(),
        id: userId
      };

      baseService.returnData.message = 'User was updated successfully';
    } catch (err) {
      console.error('Error updating a user: ', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error updating a user';
    }

    baseService.returnData.data = userResponse;

    return baseService.returnData;
  };

  return {
    create,
    doList,
    findById,
    findByUserId,
    toggleEnable,
    update
  };
};
