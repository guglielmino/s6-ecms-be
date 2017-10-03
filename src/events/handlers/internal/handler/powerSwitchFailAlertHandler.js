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

  process: ({ deviceId, gateway, requestStatus }) => {
    logger.log('info', `power switch fail alert creator ${JSON.stringify({ deviceId, gateway, requestStatus })}`);

    const alarmBuilder = new AlertBuilder(gateway, deviceId,
      `${deviceId} doesn't respond to turn ${requestStatus}`);
    alarmBuilder.setLevel(ALERT_CRITICAL);

    const alarmObj = alarmBuilder.build();

    return new Promise((resolve, reject) => {
      alertProvider.add(alarmObj)
        .then(() => {
          socket.emit(gateway, WS_DEVICE_ALARM, alarmObj);
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerSwitchFailAlertHandler;
