import {
  EventsProvider,
  GatewaysProvider,
  DevicesProvider,
  AlertsProdiver,
  DailyStatsProvider,
  HourlyStatsProvider,
} from '../data/mongodb';

// Data Providers bootstrap
export default function (db) {
  return {
    eventProvider: EventsProvider(db),
    gatewayProvider: GatewaysProvider(db),
    deviceProvider: DevicesProvider(db),
    alertProvider: AlertsProdiver(db),
    dailyStatsProvider: DailyStatsProvider(db),
    hourlyStatsProvider: HourlyStatsProvider(db),
  };
}
