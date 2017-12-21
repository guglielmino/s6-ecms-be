import logger from '../../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../../socketConsts';
import { ALERT_CRITICAL } from '../../../../../common/alertConsts';
import AlertBuilder from '../../../builders/alertBuilder';

// When same alert (same device and gateway) is received in less than
// ALERT_DELAY_SEC old alert is updated. Else a new one is created
const ALERT_DELAY_SEC = 900;


const needsNewAlert = (alert, now, alertDelay) => {
  if (alert) {
    return (((now - alert.lastUpdate) / 1000) > alertDelay);
  }
  return true;
};

const makeAlertKey = device => (`alert:energy:${device.gateway}:${device.deviceId}`);


/**
 * Process energy event checking if Power is 0 but device
 * power status is on. In that case lamp could have problem
 * @param providers
 * @constructor
 */
const PowerAlertHandler = (deviceProvider, alertProvider, socket) => {
  const getDevice = deviceId => (
    deviceProvider
      .findByDeviceId(deviceId)
  );

  const getAlert = key => (
    alertProvider
      .getLastAlertByKey(key)
  );

  const createAlert = (device, alertKey) => {
    const alarmBuilder = new AlertBuilder(device.gateway, device.deviceId,
      `${device.name} could be broken, power is 0 while state is on`);
    alarmBuilder.setLevel(ALERT_CRITICAL);
    alarmBuilder.setKey(alertKey);

    return alarmBuilder.build();
  };


  return {
    process: ({ deviceId, power }) => {
      logger.log('debug', `energy alert processor ${JSON.stringify({ deviceId, power })}`);

      return new Promise((resolve, reject) => {
        if (power < 0.1) {
          getDevice(deviceId)
            .then((device) => {
              if (device) {
                if (device.status && device.status.power === 'on') {
                  const alertKey = makeAlertKey(device);
                  getAlert(alertKey)
                    .then((alert) => {
                      let alarmObj = {};
                      if (needsNewAlert(alert, new Date(), ALERT_DELAY_SEC)) {
                        alarmObj = createAlert(device, alertKey);
                      } else {
                        alarmObj = Object.assign(alert, { lastUpdate: new Date() });
                      }
                      alertProvider.update(alarmObj, alarmObj);
                      socket.emit(device.gateway, WS_DEVICE_ALARM, alarmObj);
                      resolve();
                    });
                }
              } else {
                logger.log('error', `Energy event for unknown device : ${JSON.stringify({ deviceId, power })}`);
              }
            })
            .catch((err) => {
              logger.log('error', err);
              reject(err);
            });
        } else {
          resolve();
        }
      });
    },
  };
};

export default PowerAlertHandler;
// Note: exported for testing, using a build tool could be exported only when running tests
export { needsNewAlert, makeAlertKey };
