import logger from '../../../../../common/logger';

/**
 * Process Energy event creating daily stats
 * @param providers
 * @constructor
 */
const DailyStatHandler = dailyStatsProvider => ({
  process: ({ timestamp, gateway, deviceId, dailyconsume }) => {
    logger.log('debug', `daily stat processor ${JSON.stringify({ timestamp, gateway, deviceId, dailyconsume })}`);

    return new Promise((resolve, reject) => {
      dailyStatsProvider.getDailyStatsForDeviceId(timestamp, deviceId).then(stat =>
        // If the consume provided by the device is less than daily, it's possible the device
        // lost the connection and resulting consume is a partial one. So we sum it with preceding
        // value to have total daily consume
        (stat && (dailyconsume < stat.today) ? stat.today + dailyconsume : dailyconsume))
        .then(result =>
          dailyStatsProvider.updateDailyStat({
            date: timestamp,
            gateway,
            deviceId,
            today: result,
          }))
        .then(() => resolve())
        .catch((err) => {
          logger.log(err);
          reject(err);
        });
    });
  },
});

export default DailyStatHandler;
