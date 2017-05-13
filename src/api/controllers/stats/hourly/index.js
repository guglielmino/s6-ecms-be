import express from 'express';
import logger from '../../../../common/logger';
import { getDate, getOverlapped } from '../../../api-utils';
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
   * /api/stats/hourly:
   *   parameters:
   *     - $ref: '#/parameters/gw'
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
  router.get('/', [AuthCheck()], (req, res) => {
    const date = getDate(req);
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    hourlyStatsProvider
      .getHourlyStat(getHourlyDates(date), gws)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(stat.map(s => transformHourlyStat(s)));
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
