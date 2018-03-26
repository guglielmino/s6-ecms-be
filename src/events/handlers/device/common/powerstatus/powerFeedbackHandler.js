import merge from 'lodash/merge';
import logger from '../../../../../common/logger';
import { WS_DEVICE_POWER_FEEDBACK } from '../../../socketConsts';
import sharedDelayedQueue from '../../../../../bootstrap/sharedDelayedQueue';

/**
 * Process power status change message coming from devices
 * updating their status on database
 * @param providers
 * @constructor
 */
const PowerFeedbackHandler = (deviceProvider, socket) => ({
  process: ({ deviceId, powerStatus }) => {
    logger.log('info', `power feedback processor ${JSON.stringify({ deviceId, powerStatus })}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .findByDeviceId(deviceId)
        .then((res) => {
          const updatedObj = {
            ...res,
            status: {
              ...res.status,
              power: merge(typeof res.status.power === 'string' ?  // TODO retrocompatibility: remove when all power object are in new format
                {} : res.status.power, { [powerStatus.relayIndex]: powerStatus.power }),
            },
          };

          // Remove device from delayed queue
          // (used for alerting if response doesn't come in a defined delay)
          sharedDelayedQueue.remove(item => item.deviceId === res.deviceId);

          deviceProvider
            .update(res, updatedObj);
          // WebSocket notify
          socket.emit(res.gateway, WS_DEVICE_POWER_FEEDBACK,
            { deviceId: res.deviceId, status: powerStatus });

          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerFeedbackHandler;
