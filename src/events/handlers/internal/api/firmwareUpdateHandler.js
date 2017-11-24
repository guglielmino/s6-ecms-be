import logger from '../../../../common/logger';
import PayloadFactory from '../../factory/payloadFactory';

const factory = new PayloadFactory();

const FirmwareUpdateHandler = (deviceProvider, pnub) => ({
  process: ({ deviceId, gateway }) => {
    logger.log('info', `firmware update action processor ${JSON.stringify({ deviceId, gateway })}`);
    return new Promise((resolve, reject) => {
      deviceProvider
        .findByDeviceId(deviceId)
        .then((dev) => {
          pnub.publish(gateway, {
            type: 'MQTT',
            payload: factory.createFirmwareUpdatePayload(dev),
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
