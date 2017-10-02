import logger from '../../../../common/logger';

/**
 * Process the power switch request (typically coming from an API call).
 * Get data about the target device and send the switch on/switch off
 * message to him through PubNub
 * @param providers
 * @param pnub
 * @constructor
 */
const PowerStateHandler = (deviceProvider, pnub) => ({
  process: ({ deviceId, gateway, param }) => {
    logger.log('info', `power action processor ${JSON.stringify({ deviceId, gateway, param })}`);

    return new Promise((resolve, reject) => {
      deviceProvider
        .findByDeviceId(deviceId)
        .then((dev) => {
          if (dev.commands && dev.commands.power) {
            pnub.publish(gateway, {
              type: 'MQTT',
              payload: {
                topic: dev.commands.power.replace('mqtt:', ''),
                value: param,
              },
            });
            resolve();
          } else {
            const errMessage = `Device ${deviceId} doesn't have power command configured.`;
            reject(new Error(errMessage));
          }
        })
        .catch(err => reject(err));
    });
  },
});

export default PowerStateHandler;
