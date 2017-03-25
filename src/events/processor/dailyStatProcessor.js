import logger from '../../common/logger';

/**
 * Process Energy event creating daily stats
 * @param providers
 * @constructor
 */
const DailyStatProcessor = providers => ({
  process: (event) => {
    logger.log('debug', `daily stat processor ${JSON.stringify(event)}`);

    providers.dailyStatsProvider.updateDailyStat({
      date: event.Payload.Time,
      gateway: event.GatewayId,
      today: event.Payload.Today,
    });
  },
});

export default DailyStatProcessor;
