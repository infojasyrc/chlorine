'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupAccountsService (dbInstance) {

  const collection = dbInstance.collection('accounts');
  const baseService = new setupBaseService();

  async function getAccounts (userId) {
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

  async function getAll (userId) {
    return await getAccounts(userId);
  }

  async function checkBalance (userId) {
    const allAccountsResponse = await getAccounts(userId);

    // No errors for calculating the balance
    if (allAccountsResponse.responseCode === 200) {
      let balance = 0;
      allAccountsResponse.data.forEach(account => {
        balance += parseFloat(account.balance);
      });
      allAccountsResponse.data = balance;
      allAccountsResponse.message = 'Getting data successfully';
    }

    return allAccountsResponse;
  }

  return {
    getAll,
    checkBalance
  }
}
