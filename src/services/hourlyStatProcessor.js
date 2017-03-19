import logger from '../common/logger';

/**
 * Process Energy payload updating hourly stats.
 * Hourly stats represents the last power event seen in a specified hour.
 * @param providers
 * @constructor
 */
const HourlyStatProcessor = providers => ({
  process: (event) => {
    logger.log('debug', `hourly stat processor ${JSON.stringify(event)}`);

    providers.hourlyStatsProvider
      .updateHourlyStat({
        date: event.Payload.Time,
        gateway: event.GatewayId,
        deviceId: event.Payload.DeviceId,
        power: event.Payload.Power,
      });
  },
});

export default HourlyStatProcessor;
