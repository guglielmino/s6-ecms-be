import * as consts from '../../../consts';
import S6FValuesToHandler from '../../events/mapper/toHandlers/s6fresnel/S6FValuesToHandler';


const DeviceValuesRules = (ruleEngine, {
  deviceValuesHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_CURRENT_CONSUME,
    fn: msg => deviceValuesHandler.process(S6FValuesToHandler(msg)),
  });
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_FREQUENCY,
    fn: msg => deviceValuesHandler.process(S6FValuesToHandler(msg)),
  });
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_FACTOR,
    fn: msg => deviceValuesHandler.process(S6FValuesToHandler(msg)),
  });
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_REACTIVE_POWER_CONSUME,
    fn: msg => deviceValuesHandler.process(S6FValuesToHandler(msg)),
  });
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_VOLTAGE,
    fn: msg => deviceValuesHandler.process(S6FValuesToHandler(msg)),
  });
};

export default DeviceValuesRules;
