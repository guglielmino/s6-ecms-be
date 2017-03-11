

import express from 'express';
import logger from '../../../common/logger';
import { getDate } from '../../api-utils';
import { transformDailyStat } from './dailyStatTransformer';

export default function (app, AuthCheck, RoleCheck, { dailyStatsProvider }) {
  const router = express.Router();
  app.use('/api/stats/daily', router);
  /**
   * @swagger
   * definitions:
   *   DailyStat:
   *     properties:
   *       date:
   *         type: string
   *       gateway:
   *         type: string
   *         description: could be empty for aggregate stats
   *       value:
   *         type: number
   */

  /**
   * @swagger
   * parameters:
   *   gateway:
   *     name: gateway
   *     in: path
   *     description: gateway internal code
   *     type: string
   *     required: true
   */

  /**
   * @swagger
   * /api/stats/daily/{gateway}:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns daily stats about day consumption of devices
   *                  belonging to the specified gateway
   *     parameters:
   *      - name: date
   *        description: requested stats date
   *        type: string
   *        in: query
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/DailyStat'
   */
  router.get('/:gateway', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    dailyStatsProvider
      .getDailyStat(date, [reqGateway])
      .then((stat) => {
        res.json(stat.map(s => transformDailyStat(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * /api/stats/daily/:
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns daily stats about day consumption of devices
   *                  belonging to all the user's gateways
   *     parameters:
   *      - name: date
   *        description: requested stats date
   *        type: string
   *        in: query
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/DailyStat'
   */
  router.get('/', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;

    dailyStatsProvider
      .getDailyStat(date, gateways)
      .then((stat) => {
        res.json(stat.map(e => transformDailyStat(e)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
