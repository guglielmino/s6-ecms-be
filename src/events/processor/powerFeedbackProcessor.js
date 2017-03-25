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
      .findByPowerCommand(event.Payload.TopicName)
      .then((res) => {
        providers
          .deviceProvider
          .update(res, { ...res, status: { power: event.Payload.Power } });
      })
      .catch(err => logger.log('error', err));
  },
});

export default PowerFeedbackProcessor;
