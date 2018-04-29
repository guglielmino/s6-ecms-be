import * as consts from '../../../consts';
import S6InfoToDevice from '../../events/mapper/toHandlers/s6fresnel/S6InfoToDevice';
import S6InfoToDeviceGroups from '../../events/mapper/toHandlers/s6fresnel/S6InfoToDeviceGroups';
import S6CrontabToDeviceCrontab from '../../events/mapper/toHandlers/s6fresnel/S6CrontabToDeviceCrontab';
import SONInfoToDevice from '../../events/mapper/toHandlers/sonoff/SONInfoToDevice';


const DeviceInfoRules = (ruleEngine, {
  deviceHandler,
  deviceGroupsHandler,
  deviceCrontabHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceHandler.process(SONInfoToDevice(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_INFO ||
      msg.Type === consts.EVENT_TYPE_TOPIC_INFO,
    fn: (msg) => {
      deviceHandler.process(S6InfoToDevice(msg));
      deviceGroupsHandler.process(S6InfoToDeviceGroups(msg));
    },
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_TOPIC_CRONTAB,
    fn: msg => deviceCrontabHandler.process(S6CrontabToDeviceCrontab(msg)),
  });
};

export default DeviceInfoRules;
