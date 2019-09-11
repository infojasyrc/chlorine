'use strict';

const setupBaseService = require('./base.service');

module.exports = function setupEventsService(dbInstance) {

  const collection = dbInstance.collection('events');
  let baseService = new setupBaseService();

  const recrutingEventType = 'recruiting';
  const salesEventType = 'sales';

  async function create(data) {
    let newEvent = null;

    try {
      data.status = 'created';
      newEvent = data;
      newEvent.year = new Date(data.date).getFullYear();
      let newEventRef = await collection.add(data);
      newEvent.id = newEventRef.id;
      baseService.returnData.message = 'Event was successfully created.';
    } catch (err) {
      console.error('Error creating an event: ', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error adding a event';
    } finally {
      baseService.returnData.data = newEvent;
    }

    return baseService.returnData;
  }

  async function doList(year, withAttendeesOnly, headquarterId, showAllStatus) {
    let allEvents = [];

    try {
      if (!year) {
        baseService.returnData.message = 'No year provided';
        baseService.returnData.responseCode = 400;
        baseService.returnData.data = allEvents;
        return baseService.returnData;
      }

      let rootQuery = collection.where('year', '==', parseInt(year));

      if (!withAttendeesOnly) {
        rootQuery = rootQuery.where('headquarter.id', '==', headquarterId);
      }

      const dataSnapshot = await rootQuery.get();

      dataSnapshot.forEach((doc) => {
        let event = {
          id: doc.id,
          ...doc.data()
        };

        if (!withAttendeesOnly) {
          if (showAllStatus || event.status !== 'closed') {
            allEvents.push(event);
          }
        } else {
          if (event.attendees && event.attendees.length > 0) {
            if (showAllStatus || event.status !== 'closed') {
              allEvents.push(event);
            }
          }
        }
      });

      baseService.returnData.message = 'Getting all events successfully';
    } catch (err) {
      console.error('Error getting documents: ', err);
      baseService.returnData.message = 'Error getting all events';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = allEvents;
    }

    return baseService.returnData;
  }

  async function getEventData(id) {
    let event = {};
    try {
      const dataSnapshot = await collection.doc(id).get();

      if (dataSnapshot.exists) {
        event = dataSnapshot.data();

        if (!event.eventType) {
          event.eventType = recrutingEventType;
        }
      }
    } catch (e) {
      console.error('Error getting event information: ', err);
      event = {};
    }

    return event;
  }

  async function findById(id) {
    let event = null;

    try {
      event = await getEventData(id);
      event.id = id;
      baseService.returnData.message = 'Getting event information successfully';
    } catch (err) {
      console.error('Error getting event information: ', err);
      baseService.returnData.message = 'Error getting event information';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = event;
    }

    return baseService.returnData;
  }

  function filteredEventImages(event, deletedImages) {
    if (!event.images || (event.images && event.images.length === 0)) {
      return [];
    }

    let filteredImages = [];
    for (let i = 0; i < event.images.length; i++) {
      let found = false;
      for (let j = 0; j < deletedImages.length; j++) {
        if (event.images[i].id !== deletedImages[j]) {
          continue;
        }

        if (event.images[i].id === deletedImages[j]) {
          found = true;
          break;
        }
      }
      if (!found) {
        filteredImages.push(event.images[i]);
      }
    }

    return filteredImages;
  }

  async function update(id, data) {
    let eventData = null;
    let deletedImages = [];

    data.year = new Date(data.date).getFullYear();

    if (data.deletedImages) {
      deletedImages = data.deletedImages;
      delete data.deletedImages;
    }

    try {

      if (deletedImages.length > 0) {
        const existingEventData = await getEventData(id);
        // TODO: Implement here a call for removing image in firebase storage
        data.images = filteredEventImages(existingEventData, deletedImages);
      }

      await collection.doc(id).update(data);

      let eventRef = await collection.doc(id).get();

      eventData = {
        id: id,
        ...eventRef.data()
      };

      baseService.returnData.message = 'Event was updated successfully';
    } catch (err) {
      console.error('Error updating event information: ', err);
      baseService.returnData.message = 'Error updating event information';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = eventData;
    }

    return baseService.returnData;
  }

  async function updateImages(id, images) {
    let event = null;

    try {
      let dataSnapshot = await collection.doc(id).get();

      event = dataSnapshot.exists ?
        dataSnapshot.data() :
        null;
      event.id = id;

      if (!event.images) {
        event.images = [];
      }

      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        event.images
          .push({
            id: image.id,
            url: image.url
          });
      }

      await collection
        .doc(id)
        .update(event);

      baseService.returnData.message = 'Updated images successfully';
    } catch (err) {
      console.error('Error updating event images information: ', err);
      baseService.returnData.message = 'Error updating event images information';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = event;
    }

    return baseService.returnData;
  }

  async function deleteImage(id, idImage) {
    let event = null;

    try {
      let dataSnapshot = await collection
        .doc(id)
        .get();

      event = dataSnapshot.exists ?
        dataSnapshot.data() :
        null;

      if (!event) {
        return {
          data: {},
          message: `The event id ${id} was not found`
        };
      }

      event.id = id;

      const imageIndex = event
        .images
        .findIndex(image => {
          return image.id === idImage;
        });

      if (imageIndex < 0) {
        return {
          data: {},
          message: `The image id ${id} was not found`
        };
      }

      event
        .images
        .splice(imageIndex, 1);

      await collection
        .doc(id)
        .update(event);

      baseService.returnData.message = 'Updated images successfully';
    } catch (err) {
      console.error('Error updating event images information: ', err);
      baseService.returnData.message = 'Error updating event images information';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = event;
    }

    return baseService.returnData;
  }

  async function open(id) {
    return await setStatus(id, 'opened');
  }

  async function pause(id) {
    return await setStatus(id, 'paused');
  }

  async function close(id) {
    return await setStatus(id, 'closed');
  }

  async function setStatus(id, status) {
    let event = null;

    try {
      let dataSnapshot = await collection
        .doc(id)
        .get();

      event = dataSnapshot.exists ?
        dataSnapshot.data() :
        null;

      if (!event) {
        return {
          data: {},
          message: `The event id ${id} was not found`
        };
      }

      event.id = id;
      event.status = status;

      await collection
        .doc(id)
        .update(event);

      baseService.returnData.message = 'Event status changed succesfully';
    } catch (error) {
      console.error('Error while changing event\'s status: ', error);
      baseService.returnData.message = 'Error while changing event\'s status';
      baseService.returnData.responseCode = 500;
    } finally {
      baseService.returnData.data = event;
    }

    return baseService.returnData;
  }

  async function addAttendees(id, attendees) {
    let event = null;

    try {
      let dataSnapshot = await collection.doc(id).get();

      const event = dataSnapshot.exists ?
        dataSnapshot.data() :
        null;

      if (!event) {
        baseService.returnData.responseCode = 400;
        baseService.returnData.data = {};
        baseService.returnData.message = `The event id ${id} was not found`;
        return baseService.returnData;
      }

      if (!event.attendees) {
        event.attendees = [];
      }

      attendees.map(attendee => {
        const addedIndex = event
          .attendees
          .findIndex(addedAttendee => {
            return addedAttendee.id === attendee.id;
          });

        if (addedIndex < 0) {
          event
            .attendees
            .push(attendee);
        }
      });

      event.id = id;

      await collection.doc(id).update(event);

      baseService.returnData.message = 'Attendees added succesfully';
    } catch (error) {
      console.error('Error while adding attendees to event: ', error);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = 'Error while adding attendees to event';
    } finally {
      baseService.returnData.data = event;
    }

    return baseService.returnData;
  }

  async function remove(id) {

    try {
      await collection.doc(id).delete();
      baseService.returnData.message = 'Event successfully deleted';
    } catch (err) {
      const errorMessage = 'Error removing event';
      console.error(errorMessage + ': ', err);
      baseService.returnData.responseCode = 500;
      baseService.returnData.message = errorMessage;
    }

    return baseService.returnData;
  }

  return {
    create,
    doList,
    findById,
    update,
    updateImages,
    deleteImage,
    open,
    pause,
    close,
    addAttendees,
    remove
  };
};
