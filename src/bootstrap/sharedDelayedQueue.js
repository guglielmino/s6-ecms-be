import DelayedQueue from '../services/delayedQueue';
import logger from '../common/logger';

const sharedDelayedQueue = new DelayedQueue();
sharedDelayedQueue.setCallback((expiredItem) => {
  logger.info('info', `Expired item ${JSON.stringify(expiredItem)}`);

  // TODO: Handle the expired item to eventually create an alert
});


module.exports = sharedDelayedQueue;
