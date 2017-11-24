/**
 * Rules related to internal message, dispatched using EventEmitter,
 *
 * Sample message:

 */

import * as consts from '../../../consts';
import APIMessageToHandler from '../../events/mapper/toHandlers/apiMessages/APIMessageToHandler';

const ApiRules = (ruleEngine, {
  firmwareUpdateHandler,
  powerStateHandler,
  powerStateAlertHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_FIRMWARE,
    fn: msg => firmwareUpdateHandler.process(APIMessageToHandler(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: (msg) => {
      powerStateHandler.process(APIMessageToHandler(msg));
      powerStateAlertHandler.process(APIMessageToHandler(msg));
    },
  });
};

export default ApiRules;
