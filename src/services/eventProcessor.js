import logger from '../common/logger';

/**
 * Store the event coming from gateway "as is"
 * @param providers
 * @constructor
 */
const EventProcessor = providers => ({
  process: (event) => {
    logger.log('debug', `event processor ${JSON.stringify(event)}`);

    providers
      .eventProvider
      .add(event);
  },
});

export default EventProcessor;
