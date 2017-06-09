import logger from '../../common/logger';
import { WS_DEVICE_POWER_FEEDBACK } from './socketConsts';
import sharedDelayedQueue from '../../bootstrap/sharedDelayedQueue';
/**
 * Process power status change message coming from devices
 * updating their status on database
 * @param providers
 * @constructor
 */
const PowerFeedbackProcessor = (providers, socket) => ({
  process: (event) => {
    logger.log('info', `power feedback processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      providers
        .deviceProvider
        .findByDeviceId(event.Payload.DeviceId)
        .then((res) => {
          const updatedObj = { ...res, status: { ...res.status, power: event.Payload.Power } };
          // Remove device from delayed queue
          // (used for alerting if response doesn't come in a defined delay)
          sharedDelayedQueue.remove(item => item.deviceId === res.deviceId);

          providers
            .deviceProvider
            .update(res, updatedObj);
          // WebSocket notify
          socket.emit(res.gateway, WS_DEVICE_POWER_FEEDBACK,
            { deviceId: res.deviceId, status: event.Payload.Power });

          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerFeedbackProcessor;
