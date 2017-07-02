import * as consts from '../../consts';

import infoMapper from '../events/mapper/infoMapper';
import energyMapper from '../events/mapper/energyMapper';
import powerMapper from '../events/mapper/powerMapper';
import EventsRuleEngine from '../events/eventsRuleEngine';

import EventProcessor from '../events/processor/eventProcessor';
import DailyStatProcessor from '../events/processor/dailyStatProcessor';
import HourlyStatProcessor from '../events/processor/hourlyStatProcessor';
import DeviceProcessor from '../events/processor/deviceProcessor';
import PowerFeedbackProcessor from '../events/processor/powerFeedbackProcessor';
import PowerStateProcessor from '../events/processor/powerStateProcessor';
import PowerStateAlertProcessor from '../events/processor/powerStateAlertProcessor';
import PowerStateAlertCreator from '../events/processor/powerStateAlertCreator';
import EnergyAlertProcessor from '../events/processor/energyAlertProcessor';
import LwtProcessor from '../events/processor/lwtProcessor';
import FirmwareUpdateProcessor from '../events/processor/firmwareUpdateProcessor';

const BootstapRuleEngine = (providers, pnub, socket) => {
  const eventProcessor = EventProcessor(providers);
  const dailyProcessor = DailyStatProcessor(providers);
  const hourlyProcessor = HourlyStatProcessor(providers);
  const deviceProcessor = DeviceProcessor(providers);
  const powerFeedbackProcessor = PowerFeedbackProcessor(providers, socket);
  const powerStateProcessor = PowerStateProcessor(providers, pnub);
  const powerStateAlertProcessor = PowerStateAlertProcessor();
  const energyEventProcessor = EnergyAlertProcessor(providers, socket);
  const powerStateAlertCreator = PowerStateAlertCreator(providers, socket);
  const lwtProcessor = LwtProcessor(providers);
  const firmwareUpdateProcessor = FirmwareUpdateProcessor(providers, pnub);

  const ruleEngine = new EventsRuleEngine();

  /* -- Energy event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => eventProcessor.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => dailyProcessor.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => hourlyProcessor.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => energyEventProcessor.process(energyMapper(msg)),
  });

  /* -- Info event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceProcessor.process(infoMapper(msg)),
  });

  /* -- Power event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => powerFeedbackProcessor.process(powerMapper(msg)),
  });

  /* -- Power command  processing -- */
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateProcessor.process(msg),
  });

  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateAlertProcessor.process(msg),
  });

  ruleEngine.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_POWER_ALERT,
    fn: msg => powerStateAlertCreator.process(msg),
  });

  /* -- LWT event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtProcessor.process(msg),
  });

  /* -- Firmware update event processing -- */
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_FIRMWARE,
    fn: msg => firmwareUpdateProcessor.process(msg),
  });


  return ruleEngine;
};

export default BootstapRuleEngine;
