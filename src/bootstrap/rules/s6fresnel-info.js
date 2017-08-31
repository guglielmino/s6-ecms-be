import * as consts from '../../../consts';
import infoMapper from '../../events/mapper/s6fresnel/infoMapper';

const S6InfoRules = (ruleEngine, {
  deviceHandler,
}) => {
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_FRESNEL_INFO,
    fn: msg => deviceHandler.process(infoMapper(msg)),
  });
};

export default S6InfoRules;