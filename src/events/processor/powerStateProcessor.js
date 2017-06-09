import logger from '../../common/logger';

/**
 * Process the power switch request (typically coming from an API call).
 * Get data about the target device and send the switch on/switch off
 * message to him through PubNub
 * @param providers
 * @param pnub
 * @constructor
 */
const PowerStateProcessor = (providers, pnub) => ({
  process: (event) => {
    logger.log('info', `power action processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      providers
        .deviceProvider
        .findByDeviceId(event.deviceId)
        .then((dev) => {
          if (dev.commands && dev.commands.power) {
            pnub.publish(event.gateway, {
              type: 'MQTT',
              payload: {
                topic: dev.commands.power.replace('mqtt:', ''),
                value: event.param,
              },
            });
            resolve();
          } else {
            const errMessage = `Device ${event.deviceId} doesn't have power command configured.`;
            reject(new Error(errMessage));
          }
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerStateProcessor;
