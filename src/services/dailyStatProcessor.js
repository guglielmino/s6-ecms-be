const EnergyEventProcessor = (providers) => {
  return {
    process: (event) => {
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
  };
};

export default EnergyEventProcessor;
