import * as consts from '../../../consts';
import { types } from '../../common/alertConsts';

import S6FInstaPowerToHourly from '../../events/mapper/toHandlers/s6fresnel/S6FInstaPowerToHourly';
import SONInstaPowerToHourly from '../../events/mapper/toHandlers/sonoff/SONInstaPowerToHourly';
import SONDailyConsumeToDaily from '../../events/mapper/toHandlers/sonoff/SONDailyConsumeToDaily';

const PowerConsumptionRules = (ruleEngine, {
  hourlyStatHandler,
  dailyStatHandler,
  updateOnlineStatusHandler,
  powerAlertHandler,
  closeAlertHandler,
}) => {
  // S6 Instant power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_CONSUME,
    fn: (msg) => {
      hourlyStatHandler.process(S6FInstaPowerToHourly(msg));
      updateOnlineStatusHandler.process(S6FInstaPowerToHourly(msg));
    },
  });

  // S6 Alert if power < 0.1
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_CONSUME &&
      msg.Payload.value < 0.1,
    fn: (msg) => {
      powerAlertHandler.process(S6FInstaPowerToHourly(msg));
    },
  });

  // Close power Alert if power >= 0.1
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_CONSUME &&
      msg.Payload.value >= 0.1,
    fn: (msg) => {
      closeAlertHandler.process({
        ...S6FInstaPowerToHourly(msg),
        type: types.ALERT_TYPE_DEVICE_BROKEN,
      });
    },
  });

  // Sonoff Instan power message
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: (msg) => {
      hourlyStatHandler.process(SONInstaPowerToHourly(msg));
      dailyStatHandler.process(SONDailyConsumeToDaily(msg));
      updateOnlineStatusHandler.process(SONInstaPowerToHourly(msg));
      powerAlertHandler.process(SONInstaPowerToHourly(msg));
    },
  });
};

export default PowerConsumptionRules;
