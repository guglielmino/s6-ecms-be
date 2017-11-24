import express from 'express';

import emitter from '../../../streams/emitter';
import logger from '../../../common/logger';

/* eslint-disable no-unused-vars */
export default function (app, middlewares, { eventProvider }) {
  const router = express.Router();

  /* eslint-enable no-unused-vars */
  app.use('/api/events', router);

  /**
   * @swagger
   * /api/email/:
   *   post:
   *     tags:
   *      - Email
   *     description: Provide method to send emails
   *     produces:
   *      - application/json
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', middlewares, (req, res) => {
    try {
      emitter.emit('event', req.body);
      res.sendStatus(201);
    } catch (e) {
      logger.log('error', e);
      res.sendStatus(500);
    }
  });

  router.get('/', (req, res) => {
    const gateway = req.query.gw;
    const eventTypes = req.query.types.split(',');
    const devId = req.query.devId;

    eventProvider.getLastEvent(gateway, eventTypes, devId)
      .then(events => res.json(events))
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
