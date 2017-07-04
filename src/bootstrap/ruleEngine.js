import * as consts from '../../consts';

import infoMapper from '../events/mapper/infoMapper';
import energyMapper from '../events/mapper/energyMapper';
import powerMapper from '../events/mapper/powerMapper';
import EventsRuleEngine from '../services/eventsRuleEngine';

import EventProcessor from '../events/handlers/device/energy/eventHandler';
import DailyStatProcessor from '../events/handlers/device/energy/dailyStatHandler';
import HourlyStatProcessor from '../events/handlers/device/energy/hourlyStatHandler';
import DeviceProcessor from '../events/handlers/device/info/deviceHandler';
import PowerFeedbackProcessor from '../events/handlers/device/powerstatus/powerFeedbackHandler';
import PowerStateProcessor from '../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertProcessor from '../events/handlers/internal/api/powerStateAlertHandler';
import PowerStateAlertCreator from '../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import EnergyAlertProcessor from '../events/handlers/device/energy/energyAlertHandler';
import LwtProcessor from '../events/handlers/device/lwt/lwtHandler';
import FirmwareUpdateProcessor from '../events/handlers/internal/api/firmwareUpdateHandler';

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
