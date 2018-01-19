import { alertKey } from '../../../../../common/alertConsts';
import logger from '../../../../../common/logger';

const CloseAlertHandler = (deviceProvider, alertProvider) => ({
  process: ({ device, type }) => {
    logger.log('info', `close alert processor ${JSON.stringify(device.deviceId)}`);
    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(device.deviceId).then((dev) => {
        if (dev) {
          const key = alertKey(type, dev.gateway, dev.deviceId);
          alertProvider.getLastAlertByKey(key).then((alert) => {
            if (alert) {
              const closedAlert = { ...alert, open: false };
              alertProvider.update(alert, closedAlert);
              resolve();
            }
          });
        } else {
          logger.log('error', `Lwt alert online event for unknown device : ${JSON.stringify(device.deviceId)}`);
        }
      }).catch((err) => {
        logger.log('error', err);
        reject(err);
      });
    });
  },
});

export default CloseAlertHandler;
