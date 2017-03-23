import logger from '../common/logger';

/**
 * Process power status change message coming from devices
 * updating their status on database
 * @param providers
 * @constructor
 */
const PowerProcessor = providers => ({
  process: (event) => {
    logger.log('info', `power processor ${JSON.stringify(event)}`);

    const topicParts = event.Payload.Topic.split('/');
    let topicName = '';
    if (topicParts.length > 1) {
      topicName = topicParts[1];
    }

    providers.deviceProvider
      .findByPowerCommand(topicName)
      .then((res) => {
        providers
          .deviceProvider
          .update(res, { ...res, status: { power: event.Payload.Power } });
      })
      .catch(err => logger.log('error', err));
  },
});

export default PowerProcessor;
