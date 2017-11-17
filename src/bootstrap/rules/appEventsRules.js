/**
 * Rules related to internal message, dispatched using EventEmitter.
 * This event is dispatched when alert system detect a failure in state
 * power switch state change (relay).
 * This message is emitted by a delayed queue when an item enqueued in it expire.
 *
 *
 * Sample message:
 *
 * {
 *   type: 'AE_POWER_ALERT',
 *   gateway: 'TESTGW',
 *   deviceId: 'D7:4A:12:DA:60:93',
 *   requestStatus: 'on'
 * }
 */

import * as consts from '../../../consts';
import APPEventToHandler from '../../events/mapper/toHandlers/appEvents/appEventToHandler';

const PowerSwitchFailAlertRules = (ruleEngine, {
  powerSwitchFailAlertHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_POWER_ALERT,
    fn: msg => powerSwitchFailAlertHandler.process(APPEventToHandler(msg)),
  });
};

export default PowerSwitchFailAlertRules;
