'use service';

const setupBaseService = require('./base.service');
const setupAccountsService = require('./accounts.service');

module.exports = function setupTransactionsService (dbInstance) {

  const accountsService = setupAccountsService(dbInstance);
  const collection = dbInstance.collection('payments');
  const baseService = new setupBaseService();

  async function makeTransaction (userId, transactionData) {
    let transactionCreated = null;

    try {
      const defaultAccountResponse = await accountsService.getDefaultAccount(userId);

      if (defaultAccountResponse.responseCode !== 200) {
        baseService.returnData.responseCode = defaultAccountResponse.responseCode;
        baseService.returnData.message = defaultAccountResponse.message;
        baseService.returnData.data = null;
        return baseService.returnData;
      }

      const newTransaction = {
        userId,
        ...transactionData,
        accountId: defaultAccountResponse.data.id
      };

      const transactionRef = await collection.add(newTransaction);

      transactionCreated = {
        id: transactionRef.id,
        ...newTransaction
      };

      const updatedAccountRef = await accountsService.updateBalance(
        defaultAccountResponse.data.id,
        transactionData.amount
      );

      transactionCreated.account = updatedAccountRef.data;

      baseService.returnData.message = 'Transaction registered successfully';

    } catch (err) {
      const errorMessage = 'Error registering a transaction';
      console.error(errorMessage, err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = errorMessage;
    }

    baseService.returnData.data = transactionCreated

    return baseService.returnData;
  }

  async function deleteTransactions(userId) {
    try {
      const allTransactions = await collection.where('userId', '==', userId).get();

      allTransactions.forEach(doc => {
        collection.doc(doc.id).delete();
      });

      baseService.returnData.responseCode = 200;
      baseService.returnData.message = 'Removed all transactions per user';

    } catch (err) {
      const errorMessage = 'Error removing all user transactions';
      console.error(errorMessage, err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = errorMessage;
    }

    return baseService.returnData;
  }

  return {
    deleteTransactions,
    makeTransaction
  };
}
