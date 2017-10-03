import logger from '../../../../../common/logger';

/**
 * This handler set the online flag for the device who sent the energy message.
 * It's used to make more reliable the device online status (normally managed only by LWT message)
 * @param deviceProvider
 * @constructor
 */
const UpdateOnlineStatusHandler = deviceProvider => ({
  process: ({ deviceId }) => {
    logger.log('debug', `online status handler (energy message) ${JSON.stringify({ deviceId })}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .findByDeviceId(deviceId)
        .then((dev) => {
          deviceProvider
            .updateByDeviceId(deviceId,
              { ...dev, status: { ...dev.status, online: true } })
            .then(() => resolve());
        })
        .catch(err => reject(err));
    });
  },
});

export default UpdateOnlineStatusHandler;
