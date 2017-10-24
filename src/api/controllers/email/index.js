import emailService from 'pnp-email-service';
import * as config from '../../../config/index';


/* eslint-disable no-unused-vars */
export default function (app, middlewares) {
  const router = emailService.createRouter(config.email);

  app.use('/api/email/', [...middlewares, router]);

  return router;
}
