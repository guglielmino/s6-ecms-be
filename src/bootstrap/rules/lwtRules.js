import * as consts from '../../../consts';
import SONLwtToHandler from '../../events/mapper/sonoff/SONLwtToHandler';
import lwtAPPEventToHandler from '../../events/mapper/appEvents/lwtAPPEventToHandler';

const LwtRules = (ruleEngine, {
  lwtHandler,
  lwtStatusAlertHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtHandler.process(SONLwtToHandler(msg)),
  });
  ruleEngine.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_LWT_ALERT,
    fn: msg => lwtStatusAlertHandler.process(lwtAPPEventToHandler(msg)),
  });
};

export default LwtRules;
