import logger from 'winston';
import config from '../config';

if (config.logger.enabled) {
  logger.add(logger.transports.File, {
    filename: config.logger.path,
    json: false,
    level: config.logger.level,
  });

  if (config.logger.sentry.enabled) {
    logger.transports.Sentry = require('winston-sentry'); // eslint-disable-line global-require

    logger.add(logger.transports.Sentry, {
      dsn: config.logger.sentry.dsn,
      enabled: config.logger.sentry.enabled,
    });
  }
}

module.exports = logger;
