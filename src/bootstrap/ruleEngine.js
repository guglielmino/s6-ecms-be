import EventsRuleEngine from '../services/eventsRuleEngine';


// Handlers
import EventHandler from '../events/handlers/device/common/eventHandler';
import DeviceHandler from '../events/handlers/device/common/info/deviceHandler';
import DeviceValuesHandler from '../events/handlers/device/common/values/deviceValuesHandler';
import DeviceGroupsHandler from '../events/handlers/device/common/info/deviceGroupsHandler';
import PowerFeedbackHandler from '../events/handlers/device/common/powerstatus/powerFeedbackHandler';
import PowerStateHandler from '../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertHandler from '../events/handlers/internal/api/powerStateAlertHandler';
import PowerSwitchFailAlertHandler from '../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import LwtHandler from '../events/handlers/device/common/lwt/lwtHandler';
import CloseAlertHandler from '../events/handlers/device/common/alerts/closeAlertHandler';
import LwtStatusAlertHandler from '../events/handlers/device/common/alerts/lwtStatusAlertHandler';
import FirmwareUpdateHandler from '../events/handlers/internal/api/firmwareUpdateHandler';
import HourlyStatHandler from '../events/handlers/device/common/powerconsumption/hourlyStatHandler';
import DailyStatHandler from '../events/handlers/device/common/powerconsumption/dailyStatHandler';
import UpdateOnlineStatusHandler from '../events/handlers/device/common/onlineStatus/updateOnlineStatusHandler';


// Rules
import PowerConsumptionRules from './rules/powerConsumption';
import DailyConsumptionRules from './rules/dailyConsumptionRules';
import DeviceInfoRules from './rules/deviceInfo';
import DeviceValuesRules from './rules/deviceValuesRules';
import PowerAlertHandler from '../events/handlers/device/common/alerts/powerAlertHandler';
import ApiRules from './rules/apiRules';
import AppEventsRules from './rules/appEventsRules';
import PowerFeedbackRules from './rules/powerFeedbackRules';
import LwtRules from './rules/lwtRules';

const BootstapRuleEngine = (providers, pnub, socket, emitter) => {
  const eventHandler = EventHandler(providers.eventProvider);
  const dailyStatHandler = DailyStatHandler(providers.dailyStatsProvider);
  const hourlyStatHandler = HourlyStatHandler(providers.hourlyStatsProvider);
  const powerAlertHandler = PowerAlertHandler(providers.deviceProvider,
    providers.alertProvider, socket);
  const updateOnlineStatusHandler = UpdateOnlineStatusHandler(providers.deviceProvider);
  const deviceHandler = DeviceHandler(providers.deviceProvider);
  const powerFeedbackHandler = PowerFeedbackHandler(providers.deviceProvider, socket);
  const powerStateHandler = PowerStateHandler(providers.deviceProvider, pnub);
  const powerStateAlertHandler = PowerStateAlertHandler();
  const powerSwitchFailAlertHandler = PowerSwitchFailAlertHandler(providers.alertProvider,
    providers.deviceProvider, socket);
  const lwtHandler = LwtHandler(providers.deviceProvider, emitter);
  const closeAlertHandler = CloseAlertHandler(providers.deviceProvider, providers.alertProvider);
  const lwtStatusAlertHandler = LwtStatusAlertHandler(providers.alertProvider, socket);
  const firmwareUpdateHandler = FirmwareUpdateHandler(providers.deviceProvider, pnub);
  const deviceValuesHandler = DeviceValuesHandler(providers.deviceValuesProvider);
  const deviceGroupsHandler = DeviceGroupsHandler(providers.deviceGroupsProvider);

  const ruleEngine = new EventsRuleEngine();

  /* -- First all events are stored as they come from the Gateway -- */
  ruleEngine.add({
    predicate: () => true,
    fn: msg => eventHandler.process(msg),
  });

  /* -- Power related rules -- */
  PowerConsumptionRules(ruleEngine, {
    hourlyStatHandler,
    dailyStatHandler,
    updateOnlineStatusHandler,
    powerAlertHandler,
    closeAlertHandler,
  });

  DailyConsumptionRules(ruleEngine, { dailyStatHandler });

  /* -- Info event processing -- */
  DeviceInfoRules(ruleEngine, {
    deviceHandler,
    deviceGroupsHandler,
  });

  /* -- Values from device event processing -- */
  DeviceValuesRules(ruleEngine, { deviceValuesHandler });

  /* -- Power feedback event processing -- */
  PowerFeedbackRules(ruleEngine, { powerFeedbackHandler });

  /* -- Power Alert event processing -- */
  AppEventsRules(ruleEngine, {
    powerSwitchFailAlertHandler,
  });

  /* -- LWT event processing -- */
  LwtRules(ruleEngine, {
    lwtHandler,
    closeAlertHandler,
    lwtStatusAlertHandler,
  });

  /* -- API events processing -- */
  ApiRules(ruleEngine, {
    firmwareUpdateHandler,
    powerStateHandler,
    powerStateAlertHandler,
  });

  return ruleEngine;
};

export default BootstapRuleEngine;
