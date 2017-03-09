import logger from '../common/logger';

export default function (providers) {
  return {
    processEnergyEvent: (event) => {
      logger.log('info', `processEnergyEvent ${JSON.stringify(event)}`);
      providers.eventProvider.add(event);

      providers.statsProvider.add({
        date: event.Payload.Time,
        gateway: event.GatewayId,
        today: event.Payload.Today,
      });
    },
    processInfoEvent: (event) => {
      logger.log('info', `processInfoEvent ${JSON.stringify(event)}`);
      // Every event is stored in events collection
      providers.eventProvider.add(event);
      // Info event means devices info
      providers.deviceProvider.add(event.Payload);
    },
  };
}
