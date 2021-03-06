import DelayedQueue from '../services/delayedQueue';
import logger from '../common/logger';
import * as consts from '../../consts';
import emitter from '../streams/emitter';

const DELAY_POWER_ALERT = 2000;

const sharedDelayedQueue = new DelayedQueue(DELAY_POWER_ALERT);

sharedDelayedQueue.setCallback((expiredItem) => {
  logger.info('info', `Expired item ${JSON.stringify(expiredItem)}`);

  if (expiredItem.type === consts.APPEVENT_TYPE_POWER_ALERT) {
    emitter.emit('event', expiredItem);
  } else {
    logger.info('error', `Wrong expired item type ${expiredItem.type}`);
  }
});

export default sharedDelayedQueue;
