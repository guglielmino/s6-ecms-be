import logger from '../../common/logger';
import sharedDelayedQueue from '../../bootstrap/sharedDelayedQueue';

const PowerStateAlertProcessor = () => ({

  process: (event) => {
    logger.log('info', `device power status alert processor ${JSON.stringify(event)}`);

    // It adds in queue the device for which is required a status change
    sharedDelayedQueue.add(
      {
        type: event.type,
        deviceId: event.deviceId,
        requestStatus: event.state,
      },
      700);
  },
});

export default PowerStateAlertProcessor;

