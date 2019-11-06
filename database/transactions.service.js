'use service';

const FieldValue = require('firebase-admin').firestore.FieldValue;

const setupBaseService = require('./base.service');
const setupAccountsService = require('./accounts.service');

module.exports = function setupTransactionsService (dbInstance) {

  const accountsService = setupAccountsService(dbInstance);
  const collection = dbInstance.collection('transactions');
  const baseService = new setupBaseService();
  const paymentTransactionType = 'payment';
  const transferTransactionType = 'transfer';

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
        accountId: defaultAccountResponse.data.id,
        created: FieldValue.serverTimestamp()
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

      baseService.returnData.responseCode = 200;
      baseService.returnData.message = 'Transaction registered successfully';
      baseService.returnData.data = transactionCreated;
    } catch (err) {
      const errorMessage = 'Error registering a transaction';
      console.error(errorMessage, err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = errorMessage;
      baseService.returnData.data = {};
    }

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

  function formatTransactionDataFromRequest(data) {
    if (isPayment(data.transactionType)) {
      return {
        serviceType: data.serviceType,
        transactionType: data.transactionType,
        amount: data.amount
      };
    }

    return {
      account: data.account,
      transactionType: data.transactionType,
      amount: data.amount
    };
  }

  function isServiceTypeAvailable(transactionDataRequest) {
    return transactionDataRequest.serviceType &&
      transactionDataRequest.serviceType.length > 0;
  }

  function isTransfer(transactionType) {
    return transactionType === transferTransactionType;
  }

  function isPayment(transactionType) {
    return transactionType === paymentTransactionType;
  }

  function isAccountDataAvailable(transactionDataRequest) {
    return transactionDataRequest.account &&
      transactionDataRequest.account.name &&
      transactionDataRequest.account.name.length > 0 &&
      transactionDataRequest.account.accountNumber &&
      transactionDataRequest.account.accountNumber.length > 0 &&
      transactionDataRequest.account.phoneNumber &&
      transactionDataRequest.account.phoneNumber.length > 0;
  }

  function validateDataByTransactionType(transactionDataRequest) {
    switch(transactionDataRequest.transactionType) {
      case paymentTransactionType:
        return isServiceTypeAvailable(transactionDataRequest);
      case transferTransactionType:
        return isAccountDataAvailable(transactionDataRequest);
      default:
        return false;
    }
  }

  return {
    deleteTransactions,
    makeTransaction,
    formatTransactionDataFromRequest,
    isPayment,
    isTransfer,
    validateDataByTransactionType
  };
};
