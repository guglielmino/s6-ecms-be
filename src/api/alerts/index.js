import express from 'express';
import { transformAlert } from './alertTransformer';
import logger from '../../common/logger';
import { getOverlapped } from '../api-utils';

export default function (app, AuthCheck, RoleCheck, { alertProvider }) {
  const router = express.Router();

  app.use('/api/alerts', router);

  /**
   * @swagger
   * definitions:
   *   Alert:
   *     properties:
   *       gateway:
   *         type: string
   *       date:
   *         type: string
   *       deviceId:
   *         type: string
   *       message:
   *         type: string
   *       read:
   *         type: string
   */

  /**
   * @swagger
   * parameters:
   *   alertId:
   *     name: alertId
   *     in: path
   *     description: alert id
   *     type: string
   *     required: true
   */

  /**
   * @swagger
   * parameters:
   *   gw:
   *     name: gw
   *     in: query
   *     description: gateway internal code
   *     type: array
   *     items:
   *      type: string
   *     required: true
   */

  /**
   * @swagger
   * /api/alerts:
   *   parameters:
   *     - $ref: '#/parameters/gw'
   *   get:
   *     tags:
   *      - Alerts
   *     description: Returns alerts for the devices belonging to requesting user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Alert'
   */
  router.get('/', [AuthCheck()], (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    alertProvider
      .getAlerts(gws)
      .then((ev) => {
        if (ev.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(ev.map(e => transformAlert(e)));
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });


  /**
   * @swagger
   * /api/alerts/{alertId}:
   *   parameters:
   *     - $ref: '#/parameters/alertId'
   *   delete:
   *     tags:
   *      - Alerts
   *     description: Delete alert identified by passed id
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: Ok
   */
  router.delete('/:alertId', [AuthCheck()], (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const alertId = req.query.alertId;

    alertProvider
      .getAlertById(alertId)
      .then((alert) => {
        if (ownedGws.indexOf(alert.gateway) === -1) {
          return Promise.resolve(false);
        }

        return alertProvider
            .deleteById(alert._id); // eslint-disable-line no-underscore-dangle
      })
      .then(deleted => res.sendStatus(deleted ? 200 : 403))
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * /api/alerts/{alertId}/read:
   *   parameters:
   *     - $ref: '#/parameters/alertId'
   *   put:
   *     tags:
   *      - Alerts
   *     description: Mark the alert as read
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: Ok
   */
  router.put('/:alertId/read', [AuthCheck()], (req, res) => {
    const reqAlertId = req.params.alertId;

    alertProvider.getAlertById(reqAlertId)
      .then((alert) => {
        const newAlert = alert;
        newAlert.read = !newAlert.read;

        return alertProvider.updateById(reqAlertId, alert);
      })
      .then((result) => {
        res.sendStatus(result.status ? 200 : 204);
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
