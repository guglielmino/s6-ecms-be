import * as consts from '../../../consts';
import S6InfoToDevice from '../../events/mapper/s6fresnel/S6InfoToDevice';

import S6FInstaPowerToHourly from '../../events/mapper/s6fresnel/S6FInstaPowerToHourly';
import SONInstaPowerToHourly from '../../events/mapper/sonoff/SONInstaPowerToHourly';
import SONDailyConsumeToDaily from '../../events/mapper/sonoff/SONDailyConsumeToDaily';
import SONInfoToDevice from '../../events/mapper/sonoff/SONInfoToDevice';

const PowerConsumptionRules = (ruleEngine, {
  hourlyStatHandler,
  dailyStatHandler,
  updateOnlineStatusHandler,
}) => {
  // S6 Instant power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => hourlyStatHandler.process(S6FInstaPowerToHourly(msg)),
  });

  // Online status refreshed by power consumption event
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => updateOnlineStatusHandler.process(S6InfoToDevice(msg)),
  });

  // Sonoff Instan power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => hourlyStatHandler.process(SONInstaPowerToHourly(msg)),
  });

  // Sonoff daily power consumption handler
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => dailyStatHandler.process(SONDailyConsumeToDaily(msg)),
  });

  // Online status refreshed by energy event
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => updateOnlineStatusHandler.process(SONInfoToDevice(msg)),
  });
};

export default PowerConsumptionRules;
