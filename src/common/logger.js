import logger from 'winston';
import config from '../config';

logger.add(logger.transports.File, {
    filename: config.logger.path,
    json: false,
    level: config.logger.level
});

logger.transports.Sentry = require('winston-sentry');

logger.add(logger.transports.Sentry, {
    dsn: config.logger.sentry.dsn,
    enabled: config.logger.sentry.enabled
});

module.exports = logger;