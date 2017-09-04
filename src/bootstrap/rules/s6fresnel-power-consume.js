import * as consts from '../../../consts';
import powerConsumeMapper from '../../events/mapper/s6fresnel/powerConsumeMapper';

const S6PowerConsumeRules = (ruleEngine, {
  hourlyStatHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => hourlyStatHandler.process(powerConsumeMapper(msg)),
  });
};

export default S6PowerConsumeRules;
