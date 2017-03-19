import logger from '../common/logger';

const DeviceProcessor = providers => ({
  process: (event) => {
    logger.log('info', `device processor ${event}`);

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

export default DeviceProcessor;
