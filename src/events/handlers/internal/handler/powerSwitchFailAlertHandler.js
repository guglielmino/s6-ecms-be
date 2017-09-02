import logger from '../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../socketConsts';
import { ALERT_CRITICAL } from '../../../../common/alertConsts';
import AlertBuilder from '../../builders/alertBuilder';

/**
 * Create the alert for the timeout on receiving feedback after a power command
 * @param providers
 * @constructor
 */
const PowerSwitchFailAlertHandler = (alertProvider, socket) => ({

  process: (event) => {
    logger.log('info', `power switch fail alert creator ${JSON.stringify(event)}`);

    const alarmBuilder = new AlertBuilder(event.gateway, event.deviceId,
      `${event.deviceId} doesn't respond to turn ${event.requestStatus}`);
    alarmBuilder.setLevel(ALERT_CRITICAL);

    const alarmObj = alarmBuilder.build();

    return new Promise((resolve, reject) => {
      alertProvider.add(alarmObj)
        .then(() => {
          socket.emit(event.GatewayId, WS_DEVICE_ALARM, alarmObj);
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerSwitchFailAlertHandler;
