import express from 'express';
import logger from '../../../common/logger';
import { getDate, getOverlapped } from '../../api-utils';
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
   * /api/stats/daily:
   *   parameters:
   *     - $ref: '#/parameters/gw'
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
  router.get('/', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    dailyStatsProvider
      .getDailyStat(date, gws)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(stat.map(s => transformDailyStat(s)));
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
