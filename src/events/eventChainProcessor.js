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
    .filter(i => i.predicate(message))
    .map(m => m.fn(message));
};

export default EventsChainProcessor;
