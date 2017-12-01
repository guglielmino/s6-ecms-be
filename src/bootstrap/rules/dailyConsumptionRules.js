import * as consts from '../../../consts';
import S6FDailyConsumeToHandler from '../../events/mapper/toHandlers/s6fresnel/S6FDailyConsumeToHandler';


const DailyConsumptionRules = (ruleEngine, {
  dailyStatHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_DAILY_CONSUME,
    fn: msg => dailyStatHandler.process(S6FDailyConsumeToHandler(msg)),
  });
};

export default DailyConsumptionRules;
