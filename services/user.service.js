'use strict'

const BaseService = require('./base.service')
const User = require('./../models/user')

class UserService extends BaseService {
  constructor(dbInstance) {
    super()
    this.collection = dbInstance.collection('users')
  }

  /**
   * Create user document
   * @param {Object} userData
   */
  async create(userData) {
    let response
    const newUserData = {
      ...userData
    }

    try {
      const newUserDoc = await this.collection.add(newUserData)
      newUserData.id = newUserDoc.id
      const successMessage = 'User was successfully created'

      response = this.getSuccessResponse(newUserData, successMessage)
    } catch (error) {
      const errorMessage = 'Error creating user document'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  async doList() {
    let allUsers = [];
    let response;

    try {
      let userRefSnapshot = await this.collection.get();

      userRefSnapshot.forEach((doc) => {
        let userData = doc.data();
        userData.id = doc.id;
        allUsers.push(userData);
      });

      const successMessage = 'Getting all user list information successfully.';
      response = this.getSuccessResponse(allUsers, successMessage);
    } catch (err) {
      const errorMessage = 'Error getting user list information'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response;
  }

  async findById(id) {
    let response

    try {
      const userRefSnapshot = await this.collection.doc(id).get();

      if (!userRefSnapshot.exists) {
        return this.getSuccessResponse({}, 'No existing data');
      }
      const user = {
        ...userRefSnapshot.data(),
        id: id
      };

      const successMessage = 'Getting user information successfully';
      response = this.getSuccessResponse(user, successMessage);
    } catch (err) {
      const errorMessage = 'Error getting user information';
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage);
    }

    return response
  }

  async findByUserId(userId) {
    let user = null
    let response

    try {
      let userRefSnapshot = await this.collection
        .where('uid', '==', userId)
        .limit(1)
        .get()

      if (userRefSnapshot.docs.length === 1) {
        user = userRefSnapshot.docs[0].data()
        user.id = userRefSnapshot.docs[0].id
      }

      const successMessage = 'Getting user information successfully'
      response = this.getSuccessResponse(user, successMessage)
    } catch (err) {
      const errorMessage = 'Error getting user information'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  /**
   * Get user model
   * @param {Object} data
   */
  getModel(data) {
    return new User(data)
  }

  /**
   * Disable user for removing operation
   * @param {String} id
   */
  async toggleEnable(id) {
    let response
    try {
      const userInfoRef = await this.collection.doc(id).get();

      const userData = userInfoRef.data();
      userData.isEnabled = !userData.isEnabled;

      await this.collection.doc(id).update({
        isEnabled: userData.isEnabled
      });

      const successMessage = 'User was disabled successfully';
      response = this.getSuccessResponse(userData, successMessage);

    } catch (err) {
      const errorMessage = 'Error removing a user';
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage);
    }

    return response;
  }

  async update(userId, userData) {
    let userResponse = null
    let response

    try {
      await this.collection.doc(userId).update(userData)

      let userInfoRef = await this.collection.doc(userId).get()
      userResponse = {
        ...userInfoRef.data(),
        id: userId
      }

      const successMessage = 'User was updated successfully'
      response = this.getSuccessResponse(userResponse, successMessage)
    } catch (err) {
      const errorMessage = 'Error updating a user'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

}

module.exports = UserService
