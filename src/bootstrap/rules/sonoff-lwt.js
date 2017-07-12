/**
 * Rules related to LWT message (Last
 *
 * Sample message:
 *{
 *      GatewayId: 'TESTGW',
 *       Type: 'LWT',
 *    Payload: {
 *    Topic: 'tele/lamp3/LWT',
 *    Status: 'Online',
 *    DeviceId: '12:22:44:1a:d6:fa',
 *  },
 *}
 */

import * as consts from '../../../consts';

const LwtRules = (ruleEngine, {
  lwtHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtHandler.process(msg),
  });
};

export default LwtRules;
