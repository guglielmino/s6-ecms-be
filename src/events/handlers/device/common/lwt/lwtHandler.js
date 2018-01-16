import logger from '../../../../../common/logger';
import * as consts from '../../../../../../consts';
import { STATUS_ONLINE } from '../../../../../common/lwtConsts';

const LwtHandler = (deviceProvider, emitter) => ({
  process: ({ deviceId, status }) => {
    logger.log('info', `lwt processor ${JSON.stringify({ deviceId, status })}`);

    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(deviceId).then((dev) => {
        deviceProvider
          .updateByDeviceId(dev.deviceId,
            { ...dev, status: { ...dev.status, online: status === STATUS_ONLINE } })
          .then(() => resolve());
        // Event to create alert for lwt
        emitter.emit('event', { type: consts.APPEVENT_TYPE_LWT_ALERT, status, device: dev });
      }).catch(err => reject(err));
    });
  },
});

export default LwtHandler;
