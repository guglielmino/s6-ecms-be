import logger from '../../common/logger';
import { WS_DEVICE_ALARM } from './socketConsts';
import { ALERT_CRITICAL } from '../../common/alertConsts';

/**
 * Create the alert for the timeout on receiving feedback after a power command
 * @param providers
 * @constructor
 */
const PowerStateAlertCreator = (providers, socket) => ({

  process: (event) => {
    logger.log('info', `power state alert creator ${JSON.stringify(event)}`);

    const alarmObj = {
      gateway: event.gateway,
      date: new Date(),
      deviceId: event.deviceId,
      message: `${event.deviceId} doesn't respond to turn ${event.requestStatus}`,
      read: false,
      level: ALERT_CRITICAL,
    };

    return new Promise((resolve, reject) => {
      providers.alertProvider.add(alarmObj)
        .then(() => {
          socket.emit(event.GatewayId, WS_DEVICE_ALARM, alarmObj);
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerStateAlertCreator;
