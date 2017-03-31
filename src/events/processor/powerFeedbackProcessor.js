import logger from '../../common/logger';

/**
 * Process power status change message coming from devices
 * updating their status on database
 * @param providers
 * @constructor
 */
const PowerFeedbackProcessor = (providers, socket) => ({
  process: (event) => {
    logger.log('info', `power feedback processor ${JSON.stringify(event)}`);

    providers.deviceProvider
      .findByCommand('power', event.Payload.PowerCommand)
      .then((res) => {
        const updatedObj = { ...res, status: { power: event.Payload.Power } };
        providers
          .deviceProvider
          .update(res, updatedObj);
        // WebSocket notify
        socket.to(res.gateway).emit('WEBPUSH_DEVICE_POWER', updatedObj);
      })
      .catch(err => logger.log('error', err));
  },
});

export default PowerFeedbackProcessor;
