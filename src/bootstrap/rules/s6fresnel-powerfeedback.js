/**
 * Rules related to S6 Fresnel Power Feedback Message. This message is issued by the device when
 * power switch status (ie. relay status) change
 *
 * Sample message:
 *
 * {
 *  GatewayId: 'CASAFG',
 *  Type": 'FRESNEL_POWER_FEEDBACK',
 *  Payload: {
 *    topic: 'building/room1/events/00:11:22:33:44:55/power',
 *    deviceId: '00:11:22:33:44:55',
 *    status: 'on',
 *  },
 * }
 *
 */

import * as consts from '../../../consts';
import powerMapper from '../../events/mapper/s6fresnel/powerFeedbackMapper';

const S6PowerFeedbackRules = (ruleEngine, {
  powerFeedbackHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_FEEDBACK,
    fn: msg => powerFeedbackHandler.process(powerMapper(msg)),
  });
};

export default S6PowerFeedbackRules;
