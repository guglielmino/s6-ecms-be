import express from 'express';
import nodeExcel from 'excel-export';
import * as _ from 'lodash';
import logger from '../../../../common/logger';
import { getDate, getOverlapped, createExcelConf } from '../../../api-utils';
import { transformDailyStat } from './dailyStatTransformer';

export default function (app, middlewares, { dailyStatsProvider }) {
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
  router.get('/', middlewares, (req, res) => {
    const date = getDate(req);
    const toDate = req.query.toDate;
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;
    const format = req.query.format;

    const gws = getOverlapped(ownedGws, reqGateways);
    const filterDate = toDate ? [date, new Date(toDate)] : date;
    dailyStatsProvider
      .getDailyStat(filterDate, gws)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          const result = stat.filter(s => !_.isEmpty(s))
          .map(s => transformDailyStat(s, format));
          if (format === 'excel') {
            const conf = createExcelConf(result);
            const excel = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader('Content-Disposition', 'attachment');
            res.end(excel, 'binary');
          } else {
            res.json(result);
          }
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
