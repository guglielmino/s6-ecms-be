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

    providers.alertProvider.add(alarmObj);
    socket.emit(event.GatewayId, WS_DEVICE_ALARM, alarmObj);
  },
});

export default PowerStateAlertCreator;
