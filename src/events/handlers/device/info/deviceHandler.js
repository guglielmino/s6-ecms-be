import logger from '../../../../common/logger';

/**
 * Processes the info event creating a device in the storage
 * @param providers
 * @constructor
 */
const DeviceHandler = deviceProvider => ({
  process: (event) => {
    logger.log('debug', `device processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .updateByDeviceId(event.Payload.deviceId, event.Payload)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
});

export default DeviceHandler;
