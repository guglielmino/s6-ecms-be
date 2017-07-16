/**
 * Rules related to internal message, dispatched using EventEmitter,
 *
 * Sample message:

 */

import * as consts from '../../../consts';


const ApiFirmwareUpdateRules = (ruleEngine, {
  firmwareUpdateHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_FIRMWARE,
    fn: msg => firmwareUpdateHandler.process(msg),
  });
};

export default ApiFirmwareUpdateRules;
