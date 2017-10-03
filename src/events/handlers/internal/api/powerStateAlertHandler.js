import logger from '../../../../common/logger';
import sharedDelayedQueue from '../../../../bootstrap/sharedDelayedQueue';
import * as consts from '../../../../../consts';

/**
 * Add an item in expiring queue to handle an alert in a response doesn't come back
 * in a specific time interval
 * @constructor
 */
const PowerStateAlertHandler = () => ({

  process: ({ deviceId, gateway, param }) => {
    logger.log('info', `device power status alert processor ${JSON.stringify({ deviceId, gateway, param })}`);

    return new Promise((resolve) => {
      // Adds in queue the device for which is required a status change
      sharedDelayedQueue.add(
        {
          type: consts.APPEVENT_TYPE_POWER_ALERT,
          gateway,
          deviceId,
          requestStatus: param,
        },
        700); // TODO: make it a param ...
      resolve();
    });
  },
});

export default PowerStateAlertHandler;
