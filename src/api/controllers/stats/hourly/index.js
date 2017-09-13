import express from 'express';
import nodeExcel from 'excel-export';
import * as _ from 'lodash';
import logger from '../../../../common/logger';
import { getDate, getOverlapped, getGroupField, createExcelConf } from '../../../api-utils';
import { transformHourlyStat } from './hourlyStatTransformer';

function getHourlyDates(date) {
  const todayHours = [];
  date.setUTCHours(0);
  while (date.getUTCHours() < 23) {
    date.setUTCHours(date.getUTCHours() + 1);
    todayHours.push(new Date(date));
  }

  return todayHours;
}

export default function (app, middlewares, { hourlyStatsProvider }) {
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
  router.get('/', middlewares, (req, res) => {
    const date = getDate(req);
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;
    const format = req.query.format;
    const group = getGroupField(req);

    const gws = getOverlapped(ownedGws, reqGateways);

    hourlyStatsProvider
      .getHourlyStat(getHourlyDates(date), gws, group)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          const result = stat.filter(s => !_.isEmpty(s))
          .map(s => transformHourlyStat(s));
          if (format === 'excel') {
            const conf = createExcelConf(_.orderBy(result, 'hour'));
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

  router.get('/:deviceId', middlewares, (req, res) => {
    const deviceId = req.params.deviceId;
    const date = req.query.date;
    const reqGateways = req.query.gw;
    const ownedGws = req.user.app_metadata.gateways;

    const gws = getOverlapped(ownedGws, reqGateways);

    hourlyStatsProvider.getHourlyStatByDevice(date, gws, deviceId)
    .then((stat) => {
      if (stat.length === 0) {
        res.sendStatus(204);
      } else {
        res.json(stat.map(s => transformHourlyStat(s)));
      }
    });
  });

  return router;
}
