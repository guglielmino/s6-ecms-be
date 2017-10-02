import logger from '../../../../common/logger';

const FirmwareUpdateHandler = (deviceProvider, pnub) => ({
  process: ({ deviceId, gateway }) => {
    logger.log('info', `firmware update action processor ${JSON.stringify({ deviceId, gateway })}`);
    return new Promise((resolve, reject) => {
      deviceProvider
        .findByDeviceId(deviceId)
        .then((dev) => {
          pnub.publish(gateway, {
            type: 'MQTT',
            payload: {
              topic: `cmnd/${dev.name}/Upgrade`,
              value: '1',
            },
          });
          resolve();
        })
        .catch((err) => {
          reject(err);
          logger.log(err);
        });
    });
  },
});

export default FirmwareUpdateHandler;
