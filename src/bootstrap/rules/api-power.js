/**
 * Rules related to internal message, dispatched using EventEmitter.
 * This event is the one used to ask to device to turn ON/OFF
 *
 * Sample message:
 *  {
 *    command: 'AE_POWER_ALERT',
 *    gateway: 'TESTGW',
 *     param: 'on',
 *   }
 */

import * as consts from '../../../consts';


const ApiPowerRules = (ruleEngine, {
  powerStateHandler,
  powerStateAlertHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateHandler.process(msg),
  });

  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateAlertHandler.process(msg),
  });
};

export default ApiPowerRules;
