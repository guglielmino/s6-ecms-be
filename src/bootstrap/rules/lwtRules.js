import * as consts from '../../../consts';
import SONLwtToHandler from '../../events/mapper/toHandlers/sonoff/SONLwtToHandler';
import S6LwtToHandler from '../../events/mapper/toHandlers/s6fresnel/S6LwtToHandler';
import lwtAPPEventToHandler from '../../events/mapper/toHandlers/appEvents/lwtAPPEventToHandler';
import lwtAPPEventToAlertHandler from '../../events/mapper/toHandlers/appEvents/lwtAppEventToAlertHandler';
import { STATUS_OFFLINE, STATUS_ONLINE } from '../../common/lwtConsts';

const LwtRules = (ruleEngine, {
  lwtHandler,
  closeAlertHandler,
  lwtStatusAlertHandler,
}) => {
  /* Sonoff */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtHandler.process(SONLwtToHandler(msg)),
  });

  /* Alerts */
  ruleEngine.add({
    predicate: msg => (msg.type === consts.APPEVENT_TYPE_LWT_ALERT &&
      msg.status === STATUS_OFFLINE),
    fn: msg => lwtStatusAlertHandler.process(lwtAPPEventToHandler(msg)),
  });

  ruleEngine.add({
    predicate: msg => (msg.type === consts.APPEVENT_TYPE_LWT_ALERT &&
      msg.status === STATUS_ONLINE),
    fn: msg => closeAlertHandler.process(lwtAPPEventToAlertHandler(msg)),
  });

  /* S6 Fresnel device */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_LWT,
    fn: msg => lwtHandler.process(S6LwtToHandler(msg)),
  });
};

export default LwtRules;
