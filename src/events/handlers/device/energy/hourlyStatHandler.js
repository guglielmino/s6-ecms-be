import logger from '../../../../common/logger';

/**
 * Process Energy payload updating hourly stats.
 * Hourly stats represents the last power event seen in a specified hour.
 * @param providers
 * @constructor
 */
const HourlyStatHandler = hourlyStatsProvider => ({
  process: (event) => {
    logger.log('debug', `hourly stat processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      hourlyStatsProvider
        .updateHourlyStat({
          date: event.Payload.Time,
          gateway: event.GatewayId,
          deviceId: event.Payload.DeviceId,
          power: event.Payload.Power,
        })
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default HourlyStatHandler;
