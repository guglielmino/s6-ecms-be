import logger from '../../../../../common/logger';

const DeviceValuesHandler = deviceValuesProvider => ({
  process: ({ timestamp, gateway, deviceId, type, value, unit }) => {
    logger.log('info', `device values processor ${JSON.stringify({ deviceId, type, value, unit })}`);

    return new Promise((resolve, reject) => {
      deviceValuesProvider
        .updateDeviceValues({
          date: timestamp,
          gateway,
          deviceId,
          type,
          value,
          unit,
        })
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default DeviceValuesHandler;
