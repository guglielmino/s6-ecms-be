import express from 'express';

import emitter from '../../streams/emitter';
import logger from '../../common/logger';

/* eslint-disable no-unused-vars */
export default function (app, AuthCheck, RoleCheck, { eventProvider }) {
  const router = express.Router();

/* eslint-enable no-unused-vars */
  app.use('/api/events', router);

  /**
   * @swagger
   * /api/events/:
   *   post:
   *     tags:
   *      - Events
   *     description: Store events received from gateway
   *     produces:
   *      - application/json
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', (req, res) => {
    try {
      emitter.emit('event', req.body);
      res.sendStatus(201);
    } catch (e) {
      logger.log('error', e);
      res.sendStatus(500);
    }
  });

  return router;
}
