import logger from '../../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../../socketConsts';
import { levels, types, alertKey } from '../../../../../common/alertConsts';
import AlertBuilder from '../../../builders/alertBuilder';

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

  const createAlert = (device) => {
    const alarmBuilder = new AlertBuilder(device.gateway, device.deviceId,
      `${device.description || device.name} could be broken, power is 0 while state is on`, types.ALERT_TYPE_DEVICE_BROKEN);
    alarmBuilder.setLevel(levels.ALERT_CRITICAL);

    return alarmBuilder.build();
  };


  return {
    process: ({ deviceId }) => {
      logger.log('debug', `energy alert processor ${JSON.stringify({ deviceId })}`);

      return new Promise((resolve, reject) => {
        getDevice(deviceId)
          .then((device) => {
            if (device) {
              if (device.status && device.status.power === 'on') {
                const { gateway } = device;
                const key = alertKey(types.ALERT_TYPE_DEVICE_BROKEN, gateway, deviceId);
                getAlert(key)
                  .then((alert) => {
                    let alarmObj = {};
                    if (!alert) {
                      alarmObj = createAlert(device);
                    } else {
                      alarmObj = { ...alert, lastUpdate: new Date(), open: true, read: false };
                    }
                    alertProvider.update(alarmObj, alarmObj);
                    socket.emit(device.gateway, WS_DEVICE_ALARM, alarmObj);
                    resolve();
                  });
              }
            } else {
              logger.log('error', `Energy event for unknown device : ${JSON.stringify({ deviceId })}`);
            }
          })
          .catch((err) => {
            logger.log('error', err);
            reject(err);
          });
      });
    },
  };
};

export default PowerAlertHandler;
