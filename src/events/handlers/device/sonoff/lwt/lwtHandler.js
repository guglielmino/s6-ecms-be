import logger from '../../../../../common/logger';

const STATUS_OFFLINE = 'Offline';
const STATUS_ONLINE = 'Online';

const LwtHandler = deviceProvider => ({
  process: ({ deviceId, status }) => {
    logger.log('info', `lwt processor ${JSON.stringify({ deviceId, status })}`);

    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(deviceId).then((dev) => {
        if (status === STATUS_OFFLINE) {
          deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { ...dev.status, online: false } })
            .then(() => resolve());
        } else if (status === STATUS_ONLINE) {
          deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { ...dev.status, online: true } })
            .then(() => resolve());
        }
      }).catch(err => reject(err));
    });
  },
});

export default LwtHandler;
