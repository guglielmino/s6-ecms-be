import * as consts from '../../../consts';
import powerConsumeMapper from '../../events/mapper/s6fresnel/powerConsumeMapper';

const S6PowerConsumeRules = (ruleEngine, {
  s6hourlyStatHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TPE_FRESNEL_POWER_CONSUME,
    fn: msg => s6hourlyStatHandler.process(powerConsumeMapper(msg)),
  });
};

export default S6PowerConsumeRules;
