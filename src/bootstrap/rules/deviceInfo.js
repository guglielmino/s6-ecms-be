import * as consts from '../../../consts';
import S6InfoToDevice from '../../events/mapper/toHandlers/s6fresnel/S6InfoToDevice';
import SONInfoToDevice from '../../events/mapper/toHandlers/sonoff/SONInfoToDevice';


const DeviceInfoRules = (ruleEngine, {
  deviceHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceHandler.process(SONInfoToDevice(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_INFO,
    fn: msg => deviceHandler.process(S6InfoToDevice(msg)),
  });
};

export default DeviceInfoRules;
