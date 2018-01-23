import logger from '../../../../../common/logger';

const DeviceGroupsHandler = deviceGroupsProvider => ({
  process: ({ code, payload }) => {
    logger.log('debug', `device groups processor ${JSON.stringify({ code, payload })}`);
    return new Promise((resolve, reject) => {
      deviceGroupsProvider.updateByGroupCode(code, payload)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
});

export default DeviceGroupsHandler;
