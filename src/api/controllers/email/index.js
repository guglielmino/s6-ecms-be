const emailService = require('pnp-email-service');

/* eslint-disable no-unused-vars */
export default function (app, middlewares) {
  const router = emailService.createRouter();

  app.use('/api/email/', [...middlewares, router]);

  return router;
}
