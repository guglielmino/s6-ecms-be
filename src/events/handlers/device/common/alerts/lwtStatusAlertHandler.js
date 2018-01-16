import logger from '../../../../../common/logger';
import { WS_DEVICE_ALARM } from '../../../socketConsts';
import { levels, types } from '../../../../../common/alertConsts';
import AlertBuilder from '../../../builders/alertBuilder';

const LwtStatusAlertHandler = (alertProvider, socket) => ({
  process: ({ status, device }) => new Promise((resolve, reject) => {
    logger.log('debug', `lwt alert processor ${JSON.stringify({ device, status })}`);

    const builder = new AlertBuilder(device.gateway, device.deviceId, `${device.description || device.name} is ${status.toUpperCase()}`);
    builder.setLevel(levels.ALERT_INFO);
    builder.setType(types.ALERT_TYPE_DEVICE_OFFLINE);

    const alert = builder.build();
    alertProvider.add(alert).then(() => {
      socket.emit(device.gateway, WS_DEVICE_ALARM, alert);
      resolve();
    }).catch((err) => {
      logger.log('error', err);
      reject(err);
    });
  }),
});

export default LwtStatusAlertHandler;
