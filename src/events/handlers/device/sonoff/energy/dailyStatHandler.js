import logger from '../../../../../common/logger';

/**
 * Process Energy event creating daily stats
 * @param providers
 * @constructor
 */
const DailyStatHandler = dailyStatsProvider => ({
  process: (event) => {
    logger.log('debug', `daily stat processor ${JSON.stringify(event)}`);

    return new Promise((resolve, reject) => {
      dailyStatsProvider.updateDailyStat({
        date: event.Payload.Time,
        gateway: event.GatewayId,
        deviceId: event.Payload.DeviceId,
        today: event.Payload.Today,
      }).then(() => resolve())
        .catch((err) => {
          logger.log(err);
          reject(err);
        });
    });
  },
});

export default DailyStatHandler;
