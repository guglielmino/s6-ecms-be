/**
 * Rules related to Power Message. This message is issued by the device when
 * power switch status (ie. relay status) change
 *
 * Sample message:
 *  {
 *    GatewayId: 'SAMPLE',
 *    Type: 'POWER_STATUS',
 *    Payload: {
 *      Topic: 'stat/sonoff/RESULT',
 *      Power: 'ON',
 *      DeviceId: '00:11:22:33:44:55',
 *    },
 *  }
 */

import * as consts from '../../../consts';
import powerMapper from '../../events/mapper/powerMapper';

const PowerRules = (ruleEngine, {
  powerFeedbackHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => powerFeedbackHandler.process(powerMapper(msg)),
  });
};

export default PowerRules;
