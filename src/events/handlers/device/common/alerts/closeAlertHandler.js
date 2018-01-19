import { alertKey } from '../../../../../common/alertConsts';
import logger from '../../../../../common/logger';

const CloseAlertHandler = (deviceProvider, alertProvider) => ({
  process: ({ deviceId, type }) => {
    logger.log('info', `online alert processor ${JSON.stringify({ deviceId })}`);
    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(deviceId).then((device) => {
        if (device) {
          const key = alertKey(type, device.gateway, deviceId);
          alertProvider.getLastAlertByKey(key).then((alert) => {
            if (alert) {
              const closedAlert = { ...alert, open: false };
              alertProvider.update(alert, closedAlert);
              resolve();
            }
          });
        } else {
          logger.log('error', `Lwt alert online event for unknown device : ${JSON.stringify({ deviceId })}`);
        }
      }).catch((err) => {
        logger.log('error', err);
        reject(err);
      });
    });
  },
});

export default CloseAlertHandler;
