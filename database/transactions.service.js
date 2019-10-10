'use service';

const setupBaseService = require('./base.service');

module.exports = function setupTransactionsService (dbInstance) {

  const collection = dbInstance.collection('payments');
  const baseService = new setupBaseService();

  async function makeTransaction (userId, transactionData) {
    const newTracsaction = {
      userId,
      ...transactionData
    };
    let transactionCreated = null;

    try {
      const transactionRef = await collection.add(newTracsaction);
      transactionCreated = {
        id: transactionRef.id,
        ...newTracsaction
      };
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

  return {
    makeTransaction
  }
}
