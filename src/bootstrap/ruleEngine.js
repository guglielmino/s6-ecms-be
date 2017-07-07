import * as consts from '../../consts';

import infoMapper from '../events/mapper/infoMapper';
import energyMapper from '../events/mapper/energyMapper';
import powerMapper from '../events/mapper/powerMapper';
import EventsRuleEngine from '../services/eventsRuleEngine';

import EventHandler from '../events/handlers/device/energy/eventHandler';
import DailyStatHandler from '../events/handlers/device/energy/dailyStatHandler';
import HourlyStatHandler from '../events/handlers/device/energy/hourlyStatHandler';
import DeviceHandler from '../events/handlers/device/info/deviceHandler';
import PowerFeedbackHandler from '../events/handlers/device/powerstatus/powerFeedbackHandler';
import PowerStateHandler from '../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertHandler from '../events/handlers/internal/api/powerStateAlertHandler';
import PowerSwitchFailAlertHandler from '../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import EnergyAlertProcessor from '../events/handlers/device/energy/energyAlertHandler';
import LwtHandler from '../events/handlers/device/lwt/lwtHandler';
import FirmwareUpdateHandler from '../events/handlers/internal/api/firmwareUpdateHandler';

const BootstapRuleEngine = (providers, pnub, socket) => {
  const eventHandler = EventHandler(providers);
  const dailyHandler = DailyStatHandler(providers);
  const hourlyStatHandler = HourlyStatHandler(providers);
  const deviceHandler = DeviceHandler(providers);
  const powerFeedbackHandler = PowerFeedbackHandler(providers, socket);
  const powerStateHandler = PowerStateHandler(providers, pnub);
  const powerStateAlertHandler = PowerStateAlertHandler();
  const energyEventProcessor = EnergyAlertProcessor(providers, socket);
  const powerSwitchFailAlertHandler = PowerSwitchFailAlertHandler(providers, socket);
  const lwtHandler = LwtHandler(providers);
  const firmwareUpdateHandler = FirmwareUpdateHandler(providers, pnub);

  const ruleEngine = new EventsRuleEngine();

  /* -- Energy event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => eventHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => dailyHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => hourlyStatHandler.process(energyMapper(msg)),
  });

  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_ENERGY,
    fn: msg => energyEventProcessor.process(energyMapper(msg)),
  });

  /* -- Info event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_INFO,
    fn: msg => deviceHandler.process(infoMapper(msg)),
  });

  /* -- Power event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_POWER_STATUS,
    fn: msg => powerFeedbackHandler.process(powerMapper(msg)),
  });

  /* -- Power command  processing -- */
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateHandler.process(msg),
  });

  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_POWER,
    fn: msg => powerStateAlertHandler.process(msg),
  });

  ruleEngine.add({
    predicate: msg => msg.type === consts.APPEVENT_TYPE_POWER_ALERT,
    fn: msg => powerSwitchFailAlertHandler.process(msg),
  });

  /* -- LWT event processing -- */
  ruleEngine.add({
    predicate: msg => msg.Type === consts.EVENT_TYPE_LWT,
    fn: msg => lwtHandler.process(msg),
  });

  /* -- Firmware update event processing -- */
  ruleEngine.add({
    predicate: msg => msg.command === consts.APPEVENT_TYPE_FIRMWARE,
    fn: msg => firmwareUpdateHandler.process(msg),
  });


  return ruleEngine;
};

export default BootstapRuleEngine;
