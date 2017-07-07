import logger from '../../../../common/logger';
import sharedDelayedQueue from '../../../../bootstrap/sharedDelayedQueue';
import * as consts from '../../../../../consts';

/**
 * Add an item in expiring queue to handle an alert in a response doesn't come back
 * in a specific time interval
 * @constructor
 */
const PowerStateAlertHandler = () => ({

  process: (event) => {
    logger.log('info', `device power status alert processor ${JSON.stringify(event)}`);

    return new Promise((resolve) => {
      // Adds in queue the device for which is required a status change
      sharedDelayedQueue.add(
        {
          type: consts.APPEVENT_TYPE_POWER_ALERT,
          gateway: event.gateway,
          deviceId: event.deviceId,
          requestStatus: event.param,
        },
        700);
      resolve();
    });
  },
});

export default PowerStateAlertHandler;
