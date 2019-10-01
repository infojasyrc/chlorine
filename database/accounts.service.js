'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupAccountsService (dbInstance) {

  const collection = dbInstance.collection('accounts');
  const baseService = new setupBaseService();

  async function checkBalance (userId) {
    const allUserAccounts = [];

    try {
      let accountsQuery = collection.where('userId', '==', userId);

      const dataSnapshot = await accountsQuery.get();

      dataSnapshot.forEach((doc) => {
          const userAccount = {
            id: doc.id,
            ...doc.data()
          };
          allUserAccounts.push(userAccount);
      });

      baseService.returnData.message = 'Getting account successfully';

    } catch (err) {
      console.error('Error getting documents: ', err);
      baseService.returnData.message = 'Error getting accounts';
      baseService.returnData.responseCode = 500;
    }

    baseService.returnData.data = allUserAccounts;

    return baseService.returnData;
  }

  return {
    checkBalance
  }
}
