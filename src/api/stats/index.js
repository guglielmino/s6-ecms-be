

import express from 'express';
import logger from '../../common/logger';
import { getDate } from '../api-utils';
import { transformStat } from './statTransformer';

export default function (app, AuthCheck, RoleCheck, { eventProvider }) {
  const router = express.Router();

  app.use('/api/stats', router);

  /**
   * @swagger
   * definitions:
   *   Stat:
   *     properties:
   *       current:
   *         type: number
   *       power:
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
   * /api/stats/energy/{gateway}:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns stats about day consumption about devices benonging to gateway
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
   *             $ref: '#/definitions/Stat'
   */
  router.get('/energy/:gateway', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    eventProvider
      .getEnergyStats([reqGateway], date, false)
      .then((stat) => {
        res.json(stat.map(s => transformStat(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * /api/stats/energy/:
   *   get:
   *     tags:
   *      - Stats
   *     description: Returns stats about day consumption, data of alla gateway are aggregated
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
   *             $ref: '#/definitions/Stat'
   */
  router.get('/energy/', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const gateways = req.user.app_metadata.gateways;

    eventProvider
      .getEnergyStats(gateways, date, false)
      .then((stat) => {
        res.json(stat.map(s => transformStat(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
