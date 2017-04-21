import logger from '../../common/logger';
import { WS_DEVICE_ALARM } from './socketConsts';

/**
 * Process energy event checking if Power is 0 but device
 * power status is on. In that case lamp could have problem
 * @param providers
 * @constructor
 */
const EnergyAlertProcessor = (providers, socket) => ({
  process: (event) => {
    logger.log('debug', `energy alert processor ${JSON.stringify(event)}`);

    if (event.Payload.Power === 0) {
      providers
        .deviceProvider
        .findByDeviceId(event.Payload.DeviceId)
        .then((device) => {
          if (device.status && device.status.power === 'on') {
            const alarmObj = {
              gateway: event.GatewayId,
              date: new Date(),
              deviceId: event.Payload.DeviceId,
              message: `${device.name} could be broken, power is 0 while state is on`,
              read: false,
            };

            providers.alertProvider.add(alarmObj);
            socket.emit(event.GatewayId, WS_DEVICE_ALARM, alarmObj);
          }
        })
        .catch(err => logger.log('error', err));
    }
  },
});

export default EnergyAlertProcessor;
