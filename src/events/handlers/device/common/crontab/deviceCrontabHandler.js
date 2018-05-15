import logger from '../../../../../common/logger';

/**
 * Processes the crontab array updating the device with it
 * @param providers
 * @constructor
 */
const DeviceCrontabHandler = deviceProvider => ({
  process: ({ deviceId, payload: { crontab } }) => {
    logger.log('debug', `device crontab processor ${JSON.stringify({ deviceId, crontab })}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .updateByDeviceId(deviceId, { crontab })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
});

export default DeviceCrontabHandler;
