import logger from '../common/logger';

/**
 * Implements a Rule Engine to handle execution of right
 * function based on a predicate to evaluate the message
 * @constructor
 */
const EventsRuleEngine = function EventsRuleEngine() {
  this.rules = [];
};

/**
 * Add a new rule
 * @param {function} predicate  - if predicate evaluation is true fn is executed
 * @param {function} fn - function to be executed
 * @returns {EventsRuleEngine} - returns the rule engine itself for calls chaining
 */
EventsRuleEngine.prototype.add = function add({ predicate, fn }) {
  this.rules.push({ predicate, fn });
  return this;
};

/**
 * Handle passed message applying predicate to it and eventually executing
 * fn with message as parameter
 * @param message
 */
EventsRuleEngine.prototype.handle = function handle(message) {
  let handled = false;
  this
    .rules
    .forEach((m) => {
      if (m.predicate(message)) {
        m.fn(message);
        handled = true;
      }
    });

  if (!handled) {
    logger.log('error', `Unknown ${JSON.stringify(message)}`);
  }
};

export default EventsRuleEngine;
