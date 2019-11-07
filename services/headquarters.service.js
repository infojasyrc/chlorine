'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupHeadquartersService(dbInstance) {

  const collection = dbInstance.collection('headquarters');

  let baseService = new setupBaseService();

  async function doList() {
    let allData = [];

    try {
      let headquarterRef = await collection.get();

      headquarterRef.forEach((doc) => {
        let headquarter = {
          id: doc.id,
          ...doc.data()
        };
        allData.push(headquarter);
      });
      baseService.returnData.message = 'Getting all headquarters successfully';
    } catch (err) {
      baseService.returnData.message = 'Error getting all headquarters information';
      console.log(baseService.returnData.message + ': ', err);
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = allData;
    }

    return baseService.returnData;
  }

  async function getHeadquarter(docId) {
    let headquarterData = null;

    try {
      let headquarterRef = await collection
        .doc(docId)
        .get();

      if (headquarterRef.exists) {
        headquarterData = headquarterRef.data();
        headquarterData.id = docId;
      }

      baseService.returnData.message = 'Getting headquarter information successfully';
    } catch (err) {
      baseService.returnData.message = 'Error getting headquarter information';
      console.log(baseService.returnData.message + ': ', err);
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = headquarterData;
    }

    return baseService.returnData;
  }

  return {doList, getHeadquarter};
};
