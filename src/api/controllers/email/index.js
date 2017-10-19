import emailService from 'pnp-email-service';
// import logger from '../../../common/logger';
import * as config from '../../../config';

/* eslint-disable no-unused-vars */
export default function (app, middlewares) {
  const router = emailService.createRouter(config.email);

  /* eslint-enable no-unused-vars */
  app.use('/api/email', router);

  return router;
}
