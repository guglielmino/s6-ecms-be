import logger from '../../../../common/logger';

/**
 * Process Instant Power Consume payload updating hourly stats.
 * Hourly stats represents the last power event seen in a specified hour.
 * @param providers
 * @constructor
 */
const S6HourlyStatHandler = hourlyStatsProvider => ({
  process: (event) => {
    logger.log('debug', `hourly stat processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      hourlyStatsProvider
        .updateHourlyStat({
          date: event.Payload.timestamp,
          gateway: event.GatewayId,
          deviceId: event.Payload.deviceId,
          power: event.Payload.power,
        })
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default S6HourlyStatHandler;
