import logger from '../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../socketConsts';
import { ALERT_CRITICAL } from '../../../../common/alertConsts';

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
const EnergyAlertHandler = (deviceProvider, alertProvider, socket) => {
  const getDevice = deviceId => (
    deviceProvider
      .findByDeviceId(deviceId)
  );

  const getAlert = key => (
    alertProvider
      .getLastAlertByKey(key)
  );

  const createAlert = (event, device, alertKey) => ({
    gateway: event.GatewayId,
    date: new Date(),
    lastUpdate: new Date(),
    deviceId: event.Payload.DeviceId,
    message: `${device.name} could be broken, power is 0 while state is on`,
    read: false,
    level: ALERT_CRITICAL,
    key: alertKey,
  });


  return {
    process: (event) => {
      logger.log('debug', `energy alert processor ${JSON.stringify(event)}`);

      return new Promise((resolve, reject) => {
        if (event.Payload.Power === 0) {
          getDevice(event.Payload.DeviceId)
            .then((device) => {
              if (device) {
                if (device.status && device.status.power === 'on') {
                  const alertKey = makeAlertKey(device);

                  getAlert(alertKey)
                    .then((alert) => {
                      let alarmObj = null;
                      if (needsNewAlert(alert, new Date(), ALERT_DELAY_SEC)) {
                        alarmObj = createAlert(event, device, alertKey);
                      } else {
                        alarmObj = Object.assign(alarmObj, { lastUpdate: new Date() });
                      }

                      alertProvider.update(alarmObj);
                      socket.emit(event.GatewayId, WS_DEVICE_ALARM, alarmObj);
                      resolve();
                    });
                }
              } else {
                logger.log('error', `Energy event for unknown device : ${JSON.stringify(event)}`);
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

export default EnergyAlertHandler;
// Note: exported for testing, using a build tool could be exported only when running tests
export { needsNewAlert, makeAlertKey };
