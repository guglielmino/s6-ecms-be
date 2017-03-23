import logger from '../common/logger';

/**
 * Process the power switch request (typically coming from an API call).
 * Get data about the target device and send the switch on/switch off
 * message to him through PubNub
 * @param providers
 * @param pnub
 * @constructor
 */
const PowerActionProcessor = (providers, pnub) => ({
  process: (event) => {
    logger.log('info', `power action processor ${JSON.stringify(event)}`);

    providers
      .deviceProvider
      .findByDeviceId(event.deviceId)
      .then((dev) => {
        pnub.publish(event.gateway, {
          type: 'MQTT',
          payload: {
            topic: dev.commands.power.replace('mqtt:', ''),
            value: event.state,
          },
        });
      })
      .catch(err => logger.log('error', err));
  },
});

export default PowerActionProcessor;
