import EventsRuleEngine from '../services/eventsRuleEngine';

import EventHandler from '../events/handlers/device/sonoff/energy/eventHandler';
import DeviceHandler from '../events/handlers/device/common/info/deviceHandler';
import PowerFeedbackHandler from '../events/handlers/device/common/powerstatus/powerFeedbackHandler';
import PowerStateHandler from '../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertHandler from '../events/handlers/internal/api/powerStateAlertHandler';
import PowerSwitchFailAlertHandler from '../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import EnergyAlertHandler from '../events/handlers/device/sonoff/energy/energyAlertHandler';
import LwtHandler from '../events/handlers/device/sonoff/lwt/lwtHandler';
import FirmwareUpdateHandler from '../events/handlers/internal/api/firmwareUpdateHandler';
import UpdateOnlineStatusHandler from '../events/handlers/device/sonoff/energy/updateOnlineStatusHandler';

// Common
import HourlyStatHandler from '../events/handlers/device/common/powerconsumption/hourlyStatHandler';
import DailyStatHandler from '../events/handlers/device/common/powerconsumption/dailyStatHandler';

// Sonoff
import EnergyRules from './rules/sonoff-energy';
import InfoRules from './rules/sonoff-info';
import PowerRules from './rules/sonoff-power';
import ApiPowerRules from './rules/api-power';
import LwtRules from './rules/sonoff-lwt';
import ApiFirmwareUpdateRules from './rules/api-firmware-update';
import PowerSwitchFailAlertRules from './rules/handler-powerswitch-fail-alert';


// S6 Fresnell
import S6FresnelInfoRules from './rules/s6fresnel-info';
import S6PowerFeedbackRules from './rules/s6fresnel-powerfeedback';

// Common
import PowerConsumptionRules from './rules/powerConsumption';


const BootstapRuleEngine = (providers, pnub, socket) => {
  const eventHandler = EventHandler(providers.eventProvider);
  const dailyStatHandler = DailyStatHandler(providers.dailyStatsProvider);
  const hourlyStatHandler = HourlyStatHandler(providers.hourlyStatsProvider);
  const energyEventProcessor = EnergyAlertHandler(providers.deviceProvider,
    providers.alertProvider, socket);
  const updateOnlineStatusHandler = UpdateOnlineStatusHandler(providers.deviceProvider);
  const deviceHandler = DeviceHandler(providers.deviceProvider);
  const powerFeedbackHandler = PowerFeedbackHandler(providers.deviceProvider, socket);
  const powerStateHandler = PowerStateHandler(providers.deviceProvider, pnub);
  const powerStateAlertHandler = PowerStateAlertHandler();
  const powerSwitchFailAlertHandler = PowerSwitchFailAlertHandler(providers.alertProvider, socket);
  const lwtHandler = LwtHandler(providers.lwtHandler);
  const firmwareUpdateHandler = FirmwareUpdateHandler(providers.deviceProvider, pnub);

  const ruleEngine = new EventsRuleEngine();

  /* -- Energy message rules processing -- */
  EnergyRules(ruleEngine, {
    eventHandler,
    energyEventProcessor,
    updateOnlineStatusHandler,
  });

  PowerConsumptionRules(ruleEngine, {
    hourlyStatHandler,
    dailyStatHandler,
  });

  /* -- Info event processing -- */
  InfoRules(ruleEngine, { deviceHandler });
  S6FresnelInfoRules(ruleEngine, { deviceHandler });

  /* -- Power feedback event processing -- */
  PowerRules(ruleEngine, { powerFeedbackHandler });
  S6PowerFeedbackRules(ruleEngine, { powerFeedbackHandler });

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
