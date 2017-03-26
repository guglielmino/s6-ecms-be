import logger from '../../common/logger';

/**
 * Process power status change message coming from devices
 * updating their status on database
 * @param providers
 * @constructor
 */
const PowerFeedbackProcessor = providers => ({
  process: (event) => {
    logger.log('info', `power processor ${JSON.stringify(event)}`);

    providers.deviceProvider
      .findByCommand('power', event.Payload.PowerCommand)
      .then((res) => {
        providers
          .deviceProvider
          .update(res, { ...res, status: { power: event.Payload.Power } });
      })
      .catch(err => logger.log('error', err));
  },
});

export default PowerFeedbackProcessor;
