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
  process: (event) => {
    logger.log('info', `power feedback processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      // NOTE: Handles different property names case for different devices (Sonoff and S6Fresnel)
      const deviceId = event.Payload.DeviceId || event.Payload.deviceId;
      const power = event.Payload.Power || event.Payload.status;

      deviceProvider
        .findByDeviceId(deviceId)
        .then((res) => {
          const updatedObj = { ...res, status: { ...res.status, power } };
          // Remove device from delayed queue
          // (used for alerting if response doesn't come in a defined delay)
          sharedDelayedQueue.remove(item => item.deviceId === res.deviceId);

          deviceProvider
            .update(res, updatedObj);
          // WebSocket notify
          socket.emit(res.gateway, WS_DEVICE_POWER_FEEDBACK,
            { deviceId: res.deviceId, status: power });

          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerFeedbackHandler;
