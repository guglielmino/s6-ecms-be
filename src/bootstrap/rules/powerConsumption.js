import * as consts from '../../../consts';

import S6FInstaPowerToHourly from '../../events/mapper/toHandlers/s6fresnel/S6FInstaPowerToHourly';
import SONInstaPowerToHourly from '../../events/mapper/toHandlers/sonoff/SONInstaPowerToHourly';
import SONDailyConsumeToDaily from '../../events/mapper/toHandlers/sonoff/SONDailyConsumeToDaily';

const PowerConsumptionRules = (ruleEngine, {
  hourlyStatHandler,
  dailyStatHandler,
  updateOnlineStatusHandler,
  powerAlertHandler,
}) => {
  // S6 Instant power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => hourlyStatHandler.process(S6FInstaPowerToHourly(msg)),
  });

  // Online status refreshed by power consumption event
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => updateOnlineStatusHandler.process(S6FInstaPowerToHourly(msg)),
  });

  // Power 0 and status on alert
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => powerAlertHandler.process(S6FInstaPowerToHourly(msg)),
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
    fn: msg => updateOnlineStatusHandler.process(SONInstaPowerToHourly(msg)),
  });

  // Power 0 and status on alert
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => powerAlertHandler.process(SONInstaPowerToHourly(msg)),
  });
};

export default PowerConsumptionRules;
