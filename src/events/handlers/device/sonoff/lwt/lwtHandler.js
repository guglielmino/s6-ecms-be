import logger from '../../../../../common/logger';
import * as consts from '../../../../../../consts';
import { STATUS_OFFLINE, STATUS_ONLINE } from '../../../../../common/lwtConsts';

const LwtHandler = (deviceProvider, emitter) => ({
  process: ({ deviceId, status }) => {
    logger.log('info', `lwt processor ${JSON.stringify({ deviceId, status })}`);

    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(deviceId).then((dev) => {
        if (status === STATUS_OFFLINE) {
          deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { ...dev.status, online: false } })
            .then(() => resolve());
        } else if (status === STATUS_ONLINE) {
          deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { ...dev.status, online: true } })
            .then(() => resolve());
        }
        // Event to create alert for lwt
        emitter.emit('event', { type: consts.APPEVENT_TYPE_LWT_ALERT, status, device: dev });
      }).catch(err => reject(err));
    });
  },
});

export default LwtHandler;
