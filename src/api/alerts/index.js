import express from 'express';
import { transformAlert } from './alertTransformer';
import logger from '../../common/logger';


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
   * /api/alerts:
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
  router.get('/:gateway', [AuthCheck()], (req, res) => {
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    alertProvider
      .getAlerts([reqGateway])
      .then((ev) => {
        res.json(ev.map(e => transformAlert(e)));
      })
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
