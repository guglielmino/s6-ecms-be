import * as consts from '../../../consts';
import SONLwtToHandler from '../../events/mapper/sonoff/SONLwtToHandler';

const LwtRules = (ruleEngine, {
  lwtHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtHandler.process(SONLwtToHandler(msg)),
  });
};

export default LwtRules;
