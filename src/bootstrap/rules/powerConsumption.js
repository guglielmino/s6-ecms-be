import * as consts from '../../../consts';
import S6FInstaPowerToHourly from '../../events/mapper/s6fresnel/S6FInstaPowerToHourly';
import SONInstaPowerToHourly from '../../events/mapper/sonoff/SONInstaPowerToHourly';
import SONDailyConsumeToDaily from '../../events/mapper/sonoff/SONDailyConsumeToDaily';

const PowerConsumptionRules = (ruleEngine, {
  hourlyStatHandler,
  dailyStatHandler,
}) => {
  // S6 Instant power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => hourlyStatHandler.process(S6FInstaPowerToHourly(msg)),
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
};

export default PowerConsumptionRules;
