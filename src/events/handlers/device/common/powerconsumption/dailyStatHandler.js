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
      dailyStatsProvider.updateDailyStat({
        date: timestamp,
        gateway,
        deviceId,
        today: dailyconsume,
      }).then(() => resolve())
        .catch((err) => {
          logger.log(err);
          reject(err);
        });
    });
  },
});

export default DailyStatHandler;
