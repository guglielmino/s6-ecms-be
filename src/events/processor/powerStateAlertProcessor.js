import logger from '../../common/logger';
import sharedDelayedQueue from '../../bootstrap/sharedDelayedQueue';
import * as consts from '../../../consts';


const PowerStateAlertProcessor = () => ({

  process: (event) => {
    logger.log('info', `device power status alert processor ${JSON.stringify(event)}`);

    // Adds in queue the device for which is required a status change
    sharedDelayedQueue.add(
      {
        type: consts.APPEVENT_TYPE_POWER_ALERT,
        gateway: event.gateway,
        deviceId: event.deviceId,
        requestStatus: event.state,
      },
      700);
  },
});

export default PowerStateAlertProcessor;
