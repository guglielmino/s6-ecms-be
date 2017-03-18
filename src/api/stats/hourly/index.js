

import express from 'express';
import logger from '../../../common/logger';
import { getDate } from '../../api-utils';
import { transformHourlyStat } from './hourlyStatTransformer';

function getHourlyDates(date) {
  const todayHours = [];
  date.setUTCHours(7);
  while (date.getUTCHours() < 23) {
    date.setUTCHours(date.getUTCHours() + 1);
    todayHours.push(new Date(date));
  }

  return todayHours;
}

export default function (app, AuthCheck, RoleCheck, { hourlyStatsProvider }) {
  const router = express.Router();
  app.use('/api/stats/hourly', router);

  /**
   * @swagger
   * definitions:
   *   HourlyStat:
   *     properties:
   *       deviceId:
   *         type: string
   *         description: could be empty for aggregate stats
   *       power:
   *         type: number
   *       hour:
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
   * /api/stats/hourly/{gateway}:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns hourly stats about day consumption of devices belonging to gateway
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
   *             $ref: '#/definitions/HourlyStat'
   */
  router.get('/:gateway', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    hourlyStatsProvider
      .getHourlyStat(getHourlyDates(date), [reqGateway])
      .then((stat) => {
        res.json(stat.map(s => transformHourlyStat(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * /api/stats/hourly/:
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns hourly stats about day consumption for all user gateways
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
   *             $ref: '#/definitions/HourlyStat'
   */
  router.get('/', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;

    hourlyStatsProvider
      .getHourlyStat(getHourlyDates(date), gateways)
      .then((stat) => {
        res.json(stat.map(s => transformHourlyStat(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
