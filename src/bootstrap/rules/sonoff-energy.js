/**
 * Rules related to Energy messages coming from Sonoff devices
 * Energy message is issued on a time based frequency,
 * Sample message:
 * {
 *  "Time": "2017-07-08T12:47:36",
 *  "Energy": {
 *    "Yesterday": "0.025",
 *    "Today": "0.000",
 *    "Period": 0,
 *    "Power": 0,
 *    "Factor": "0.00",
 *    "Voltage": 0,
 *    "Current": "0.000",
 *    "DeviceId": "5C:CF:7F:A0:2D:C6"
 *  }
 *}
 */

import * as consts from '../../../consts';
import energyMapper from '../../events/mapper/energyMapper';

const EnergyRules = (ruleEngine, {
  dailyHandler,
  eventHandler,
  hourlyStatHandler,
  energyEventProcessor,
  updateOnlineStatusHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => eventHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => dailyHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => hourlyStatHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => energyEventProcessor.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => updateOnlineStatusHandler.process(energyMapper(msg)),
  });
};

export default EnergyRules;
