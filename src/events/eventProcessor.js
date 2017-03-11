import logger from '../common/logger';

export default function (providers) {
  return {
    processEnergyEvent: (event) => {
      logger.log('info', `processEnergyEvent ${JSON.stringify(event)}`);
      providers.eventProvider.add(event);

      providers.dailyStatsProvider.updateDailyStat({
        date: event.Payload.Time,
        gateway: event.GatewayId,
        today: event.Payload.Today,
      });

      providers.hourlyStatsProvider.updateHourlyStat({
        date: event.Payload.Time,
        gateway: event.GatewayId,
        deviceId: event.Payload.DeviceId,
        power: event.Payload.Power,
      });
    },
    processInfoEvent: (event) => {
      logger.log('info', `processInfoEvent ${JSON.stringify(event)}`);
      providers.eventProvider.add(event);
      providers.deviceProvider.add(event.Payload);
    },
    processPowerStatus: (event) => {
      logger.log('info', `processPowerStatus ${JSON.stringify(event)}`);
      providers.eventProvider.add(event);

      const topicParts = event.Payload.Topic.split('/');
      let topicName = '';
      if (topicParts.length > 1) {
        topicName = topicParts[1];
      }

      providers.deviceProvider
        .findByPowerCommand(topicName)
        .then((res) => {
          providers
            .deviceProvider
            .update(res, { ...res, status: { power: event.Payload.Power } });
        })
        .catch(err => logger.log('error', err));
    },
  };
}
