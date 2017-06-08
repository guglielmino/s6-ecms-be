import logger from '../../common/logger';

const FirmwareUpdateProcessor = (providers, pnub) => ({
  process: (event) => {
    logger.log('info', `power action processor ${JSON.stringify(event)}`);
    return new Promise((resolve, reject) => {
      providers
        .deviceProvider
        .findByDeviceId(event.deviceId)
        .then((dev) => {
          pnub.publish(event.gateway, {
            type: 'MQTT',
            payload: {
              topic: `cmnd/${dev.name}/Update`,
              value: '',
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

export default FirmwareUpdateProcessor;
