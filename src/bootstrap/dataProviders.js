import {
  EventsProvider,
  GatewaysProvider,
  DevicesProvider,
  AlertsProvider,
  DailyStatsProvider,
  HourlyStatsProvider,
} from '../data/mongodb';

// Data Providers bootstrap
export default function (db) {
  return {
    eventProvider: EventsProvider(db),
    gatewayProvider: GatewaysProvider(db),
    deviceProvider: DevicesProvider(db),
    alertProvider: AlertsProvider(db),
    dailyStatsProvider: DailyStatsProvider(db),
    hourlyStatsProvider: HourlyStatsProvider(db),
  };
}
