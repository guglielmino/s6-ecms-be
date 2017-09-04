/**
 * Rules related to Info messages coming from Sonoff devices
 * Info message is issued when device starts, it brings information about
 * device and firmware
 *
 * Sample message:
 * {
 *  GatewayId: 'testGateway',
 *  Type: 'INFO',
 *  Payload: {
 *    AppName: 'Sonoff Pow',
 *    Version: '1.2.3',
 *    FallbackTopic: 'sonoffback',
 *    GroupTopic: 'sogroup',
 *    DeviceId: '2d:5f:22:99:73:d5',
 *    Topic: 'cmnd/sonoff',
 *  },
 * }
 */

import * as consts from '../../../consts';
import infoMapper from '../../events/mapper/sonoff/infoMapper';

const InfoRules = (ruleEngine, {
  deviceHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceHandler.process(infoMapper(msg)),
  });
};

export default InfoRules;
