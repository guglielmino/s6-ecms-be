import logger from '../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../socketConsts';
import { levels, types } from '../../../../common/alertConsts';
import AlertBuilder from '../../builders/alertBuilder';

/**
 * Create the alert for the timeout on receiving feedback after a power command
 * @param providers
 * @constructor
 */
const PowerSwitchFailAlertHandler = (alertProvider, devicesProvider, socket) => ({

  process: ({ deviceId, gateway, requestStatus }) => {
    logger.log('info', `power switch fail alert creator ${JSON.stringify({ deviceId, gateway, requestStatus })}`);

    return new Promise((resolve, reject) => {
      devicesProvider.findByDeviceId(deviceId).then((dev) => {
        if (dev) {
          const alarmBuilder = new AlertBuilder(gateway, deviceId,
            `${dev.description || dev.name} doesn't respond to turn ${requestStatus}`);
          alarmBuilder.setLevel(levels.ALERT_CRITICAL);
          alarmBuilder.setType(types.ALERT_TYPE_POWER_SWITCH_FAIL);

          const alarmObj = alarmBuilder.build();

          alertProvider.add(alarmObj)
            .then(() => {
              socket.emit(gateway, WS_DEVICE_ALARM, alarmObj);
              resolve();
            });
        } else {
          const error = new Error(`Error in PowerSwitchFailAlertHandler: ${deviceId} not found`);
          logger.log('debug', error);
          reject(error);
        }
      })
      .catch(err => reject(err));
    });
  },
});

export default PowerSwitchFailAlertHandler;
