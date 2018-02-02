import logger from '../../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../../socketConsts';
import { levels, types, alertKey } from '../../../../../common/alertConsts';
import AlertBuilder from '../../../builders/alertBuilder';

const LwtStatusAlertHandler = (alertProvider, socket) => ({
  process: ({ status, device }) => new Promise((resolve, reject) => {
    logger.log('debug', `lwt alert processor ${JSON.stringify({ device, status })}`);

    const builder = new AlertBuilder(device.gateway, device.deviceId, `${device.description || device.name} is ${status.toUpperCase()}`,
      types.ALERT_TYPE_DEVICE_STATUS);
    builder.setLevel(levels.ALERT_INFO);

    const key = alertKey(types.ALERT_TYPE_DEVICE_STATUS, device.gateway, device.deviceId);

    alertProvider.getLastAlertByKey(key).then((alert) => {
      let alertObj = {};
      if (!alert) {
        alertObj = builder.build();
      } else {
        alertObj = { ...alert, lastUpdate: new Date() };
      }
      alertProvider.update(alertObj, alertObj);
      socket.emit(device.gateway, WS_DEVICE_ALARM, alertObj);
      resolve();
    })
      .catch((err) => {
        logger.log('error', err);
        reject(err);
      });
  }),
});

export default LwtStatusAlertHandler;
