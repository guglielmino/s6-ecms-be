import * as consts from '../../../consts';
import S6StatusToHandler from '../../events/mapper/toHandlers/s6fresnel/S6StatusToHandler';
import SONStatusToHandler from '../../events/mapper/toHandlers/sonoff/SONStatusToHandler';

const PowerFeedbackRules = (ruleEngine, {
  powerFeedbackHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_POWER_FEEDBACK,
    fn: msg => powerFeedbackHandler.process(S6StatusToHandler(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => powerFeedbackHandler.process(SONStatusToHandler(msg)),
  });
};

export default PowerFeedbackRules;
