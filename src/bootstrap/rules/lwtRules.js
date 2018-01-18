import * as consts from '../../../consts';
import { types } from '../../common/alertConsts';
import SONLwtToHandler from '../../events/mapper/toHandlers/sonoff/SONLwtToHandler';
import S6LwtToHandler from '../../events/mapper/toHandlers/s6fresnel/S6LwtToHandler';
import lwtAPPEventToHandler from '../../events/mapper/toHandlers/appEvents/lwtAPPEventToHandler';
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
    fn: msg => closeAlertHandler.process({ ...lwtAPPEventToHandler(msg),
      type: types.ALERT_TYPE_DEVICE_STATUS }),
  });

  /* S6 Fresnel device */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_LWT,
    fn: msg => lwtHandler.process(S6LwtToHandler(msg)),
  });
};

export default LwtRules;
