import logger from '../../common/logger';
import SonoffPowTopicHanlders from '../../services/sonoffPowTopicHandler';

const topicHanlders = SonoffPowTopicHanlders();
const STATUS_OFFLINE = 'Offline';
const STATUS_ONLINE = 'Online';

const LwtProcessor = providers => ({
  process: (event) => {
    logger.log('info', `lwt processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      const deviceName = topicHanlders.extractNameFromTopic('tele', event.Payload.Topic);

      providers.deviceProvider.findByName(deviceName).then((dev) => {
        if (event.Payload.Status === STATUS_OFFLINE) {
          providers.deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { online: false } })
            .then(() => resolve());
        } else if (event.Payload.Status === STATUS_ONLINE) {
          providers.deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { online: true } })
            .then(() => resolve());
        }
      }).catch(err => reject(err));
    });
  },
});

export default LwtProcessor;
