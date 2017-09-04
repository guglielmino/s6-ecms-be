import logger from '../../../../../common/logger';

const STATUS_OFFLINE = 'Offline';
const STATUS_ONLINE = 'Online';

const LwtHandler = deviceProvider => ({
  process: (event) => {
    logger.log('info', `lwt processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      deviceProvider.findByDeviceId(event.Payload.DeviceId).then((dev) => {
        if (event.Payload.Status === STATUS_OFFLINE) {
          deviceProvider
            .updateByDeviceId(dev.deviceId,
              { ...dev, status: { ...dev.status, online: false } })
            .then(() => resolve());
        } else if (event.Payload.Status === STATUS_ONLINE) {
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
