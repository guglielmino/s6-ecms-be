import logger from '../../../../../common/logger';

/**
 * Processes the info event creating a device in the storage
 * @param providers
 * @constructor
 */
const DeviceHandler = deviceProvider => ({
  process: ({ deviceId, payload }) => {
    logger.log('debug', `device processor ${JSON.stringify({ deviceId, payload })}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .updateByDeviceId(deviceId, payload)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
});

export default DeviceHandler;
