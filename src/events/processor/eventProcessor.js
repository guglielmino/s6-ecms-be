import logger from '../../common/logger';

/**
 * Store the event coming from gateway "as is"
 * @param providers
 * @constructor
 */
const EventProcessor = providers => ({
  process: (event) => {
    logger.log('debug', `event processor ${JSON.stringify(event)}`);
    return new Promise((resolve, reject) => {
      providers
        .eventProvider
        .add(event)
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default EventProcessor;
