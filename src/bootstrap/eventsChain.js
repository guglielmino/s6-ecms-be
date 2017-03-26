import * as consts from '../../consts';

import infoMapper from '../events/mapper/infoMapper';
import energyMapper from '../events/mapper/energyMapper';
import powerMapper from '../events/mapper/powerMapper';
import EventsChainProcessor from '../events/eventChainProcessor';

import EventProcessor from '../events/processor/eventProcessor';
import DailyStatProcessor from '../events/processor/dailyStatProcessor';
import HourlyStatProcessor from '../events/processor/hourlyStatProcessor';
import DeviceProcessor from '../events/processor/deviceProcessor';
import PowerFeedbackProcessor from '../events/processor/powerFeedbackProcessor';
import PowerActionProcessor from '../events/processor/powerActionProcessor';

const BootstapEventsChain = (providers, pnub, socket) => {
  const eventProcessor = EventProcessor(providers);
  const dailyProcessor = DailyStatProcessor(providers);
  const hourlyProcessor = HourlyStatProcessor(providers);
  const deviceProcessor = DeviceProcessor(providers);
  const powerFeedbackProcessor = PowerFeedbackProcessor(providers, socket);
  const powerActionProcessor = PowerActionProcessor(providers, pnub);

  const eventsChain = new EventsChainProcessor();

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => eventProcessor.process(energyMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => dailyProcessor.process(energyMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => hourlyProcessor.process(energyMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceProcessor.process(infoMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => powerFeedbackProcessor.process(powerMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerActionProcessor.process(msg),
  });

  return eventsChain;
};

export default BootstapEventsChain;
