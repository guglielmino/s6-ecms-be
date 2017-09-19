import logger from '../../../../../common/logger';

/**
 * Process Instant Power Consume payload updating hourly stats.
 * Hourly stats represents the last power event seen in a specified hour.
 * @param providers
 * @constructor
 */
const HourlyStatHandler = hourlyStatsProvider => ({
  process: ({ timestamp, gateway, deviceId, power }) => {
    logger.log('debug', `hourly stat processor ${JSON.stringify({ timestamp, gateway, deviceId, power })}`);

    return new Promise((resolve, reject) => {
      hourlyStatsProvider
        .updateHourlyStat({
          date: timestamp,
          gateway,
          deviceId,
          power,
        })
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
  },
});

export default HourlyStatHandler;
