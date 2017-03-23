import * as consts from '../../consts';

import infoMapper from '../data/observable/mappers/infoMapper';
import energyMapper from '../data/observable/mappers/energyMapper';
import powerMapper from '../data/observable/mappers/powerMapper';
import EventsChainProcessor from '../events/eventChainProcessor';

import EventProcessor from '../services/eventProcessor';
import DailyStatProcessor from '../services/dailyStatProcessor';
import HourlyStatProcessor from '../services/hourlyStatProcessor';
import DeviceProcessor from '../services/deviceProcessor';
import PowerProcessor from '../services/powerProcessor';
import PowerActionProcessor from '../services/powerActionProcessor';

const BootstapEventsChain = (providers, pnub, socket) => {
  const eventProcessor = EventProcessor(providers);
  const dailyProcessor = DailyStatProcessor(providers);
  const hourlyProcessor = HourlyStatProcessor(providers);
  const deviceProcessor = DeviceProcessor(providers);
  const powerProcessor = PowerProcessor(providers);
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
    fn: msg => powerProcessor.process(powerMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => socket.emit('WEBPUSH_DEVICE_POWER', powerMapper(msg)),
  });

  eventsChain.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerActionProcessor.process(msg),
  });

  return eventsChain;
};

export default BootstapEventsChain;
