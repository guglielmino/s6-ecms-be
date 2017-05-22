import logger from '../common/logger';

/**
 * Implements a Chain Of Responsability to handle execution of right
 * function based on a predicate to evaluate the message
 * @constructor
 */
const EventsChainProcessor = function EventsChainProcessor() {
  this.chain = [];
};

EventsChainProcessor.prototype.add = function add({ predicate, fn }) {
  this.chain.push({ predicate, fn });
  return this;
};

EventsChainProcessor.prototype.handle = function handle(message) {
  this
    .chain
    .forEach((m) => {
      if (m.predicate(message)) {
        m.fn(message);
      } else {
        logger.log('error', `Unknown ${JSON.stringify(message)}`);
      }
    });
};

export default EventsChainProcessor;
