'use service';

const setupBaseService = require('./base.service');

module.exports = function setupMetadataService(adminInstance) {
  
  async function updateRevokeTime(userId, revocationTime) {
    const metadataRef = adminInstance.ref('metadata/' + userId);
    try {

      await metadataRef.set({revokeTime: revocationTime});
      baseService.returnData.message = 'Database updated successfully';
      baseService.returnData.data = {};
      baseService.returnData.responseCode = 200;

    } catch (err) {
      const errorMessage = 'Error updating metadata';
      console.error(errorMessage, err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = errorMessage;
    }

    return baseService.returnData;
  }

  return {
    updateRevokeTime
  }
};