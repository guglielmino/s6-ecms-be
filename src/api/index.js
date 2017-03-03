import logger from '../common/logger';

export default function (config, app) {
  const { host, port } = config.server;

  // Default error handler
  app.use((err, req, res, next) => {
    logger.log('error', `API error ${err}`);
    res.sendStatus(500);
    next(err);
  });

  const server = require('http') // eslint-disable-line global-require
    .createServer(app);

  server.listen(port);
  logger.log('info', `Listening on http://${host}:${port}`);
  return server;
}
