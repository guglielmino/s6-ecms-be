import EventsRuleEngine from '../services/eventsRuleEngine';

import EventHandler from '../events/handlers/device/energy/eventHandler';
import DailyStatHandler from '../events/handlers/device/energy/dailyStatHandler';
import HourlyStatHandler from '../events/handlers/device/energy/hourlyStatHandler';
import DeviceHandler from '../events/handlers/device/info/deviceHandler';
import PowerFeedbackHandler from '../events/handlers/device/powerstatus/powerFeedbackHandler';
import PowerStateHandler from '../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertHandler from '../events/handlers/internal/api/powerStateAlertHandler';
import PowerSwitchFailAlertHandler from '../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import EnergyAlertHandler from '../events/handlers/device/energy/energyAlertHandler';
import LwtHandler from '../events/handlers/device/lwt/lwtHandler';
import FirmwareUpdateHandler from '../events/handlers/internal/api/firmwareUpdateHandler';

import EnergyRules from './rules/sonoff-energy';
import InfoRules from './rules/sonoff-info';
import PowerRules from './rules/sonoff-power';
import ApiPowerRules from './rules/api-power';
import LwtRules from './rules/sonoff-lwt';
import ApiFirmwareUpdateRules from './rules/api-firmware-update';
import PowerSwitchFailAlertRules from './rules/handler-powerswitch-fail-alert';

const BootstapRuleEngine = (providers, pnub, socket) => {
  const eventHandler = EventHandler(providers.eventProvider);
  const dailyHandler = DailyStatHandler(providers.dailyStatsProvider);
  const hourlyStatHandler = HourlyStatHandler(providers.hourlyStatsProvider);
  const energyEventProcessor = EnergyAlertHandler(providers.deviceProvider,
    providers.alertProvider, socket);
  const deviceHandler = DeviceHandler(providers.deviceProvider);
  const powerFeedbackHandler = PowerFeedbackHandler(providers.deviceProvider, socket);
  const powerStateHandler = PowerStateHandler(providers.deviceProvider, pnub);
  const powerStateAlertHandler = PowerStateAlertHandler();
  const powerSwitchFailAlertHandler = PowerSwitchFailAlertHandler(providers.alertProvider, socket);
  const lwtHandler = LwtHandler(providers.lwtHandler);
  const firmwareUpdateHandler = FirmwareUpdateHandler(providers.firmwareUpdateHandler, pnub);

  const ruleEngine = new EventsRuleEngine();

  /* -- Energy message rules processing -- */
  EnergyRules(ruleEngine, {
    dailyHandler,
    eventHandler,
    hourlyStatHandler,
    energyEventProcessor,
  });

  /* -- Info event processing -- */
  InfoRules(ruleEngine, { deviceHandler });

  /* -- Power event processing -- */
  PowerRules(ruleEngine, { powerFeedbackHandler });

  /* -- Power command  processing -- */

  ApiPowerRules(ruleEngine, {
    powerStateHandler,
    powerStateAlertHandler,
  });

  /* -- Power Alert event processing -- */
  PowerSwitchFailAlertRules(ruleEngine, {
    powerSwitchFailAlertHandler,
  });

  /* -- LWT event processing -- */
  LwtRules(ruleEngine, { lwtHandler });

  /* -- Firmware update event processing -- */
  ApiFirmwareUpdateRules(ruleEngine, { firmwareUpdateHandler });

  return ruleEngine;
};

export default BootstapRuleEngine;
