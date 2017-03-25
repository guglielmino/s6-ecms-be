import logger from '../../common/logger';

/**
 * Processes the info event creating a device in the storage
 * @param providers
 * @constructor
 */
const DeviceProcessor = providers => ({
  process: (event) => {
    logger.log('debug', `device processor ${JSON.stringify(event)}`);

     // Payload.deviceId
    providers.deviceProvider.add(event.Payload);
  },
});

export default DeviceProcessor;
