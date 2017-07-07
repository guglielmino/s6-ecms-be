import logger from '../../../../common/logger';

const FirmwareUpdateHandler = (providers, pnub) => ({
  process: (event) => {
    logger.log('info', `firmware update action processor ${JSON.stringify(event)}`);
    return new Promise((resolve, reject) => {
      providers
        .deviceProvider
        .findByDeviceId(event.deviceId)
        .then((dev) => {
          pnub.publish(event.gateway, {
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
