import express from 'express';
import emitter from '../../emitter';
import logger from '../../common/logger';
import { transformDevice } from './deviceTransformer';
import * as consts from '../../../consts';

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
   * parameters:
   *   deviceId:
   *     name: deviceId
   *     in: path
   *     description: deviceId (device mac address)
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

  /**
   * @swagger
   * definitions:
   *   PowerPayload:
   *     properties:
   *       state:
   *         type: string
   *         description: state of the device, should be "on" or "off"
   */

  /**
   * @swagger
   * /api/devices/{gateway}/{deviceId}/power:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *     - $ref: '#/parameters/deviceId'
   *     - name: state
   *       in: body
   *       description: The pet JSON you want to post
   *       schema:
   *         $ref: '#/definitions/PowerPayload'
   *       required: true
   *   post:
   *     tags:
   *      - Devices
   *     description: Turn on/off a device
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: done
   */
  router.post('/:gateway/:device/power', [], (req, res) => {
    const reqGateway = req.params.gateway;
    const reqDevice = req.params.device;

    try {
      emitter.emit('event', { ...req.body, gateway: reqGateway, deviceId: reqDevice, type: consts.APPEVENT_TYPE_POWER });
      res.sendStatus(200);
    } catch (e) {
      logger.log('error', e);
      res.sendStatus(500);
    }
  });

  return router;
}
