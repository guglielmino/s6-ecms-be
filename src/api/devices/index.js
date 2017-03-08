import express from 'express';
import logger from '../../common/logger';
import { transformDevice } from './deviceTransformer';

export default function (app, AuthCheck, RoleCheck, { deviceProvider }) {
  const router = express.Router();

  app.use('/api/devices', router);

  /**
   * @swagger
   * definitions:
   *   Device:
   *     properties:
   *       name:
   *         type: string
   *       deviceId:
   *         type: string
   *       type:
   *         type: string
   *       version:
   *         type: string
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
   * /api/devices/{gateway}:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *   get:
   *     tags:
   *      - Devices
   *     description: Returns devices belonging to the specified gateway
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Device'
   */

  router.get('/:gateway', [AuthCheck()], (req, res) => {
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    deviceProvider
      .getDevices([reqGateway])
      .then((stat) => {
        res.json(stat.map(e => transformDevice(e)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });


  return router;
}
