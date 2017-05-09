import express from 'express';
import validate from 'express-validation';
import emitter from '../../streams/emitter';
import logger from '../../common/logger';

import { transformDevice } from './deviceTransformer';
import { getOverlapped } from '../api-utils';

import deviceCommandValidator from './device.command.validation';

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
   *   deviceId:
   *     name: deviceId
   *     in: path
   *     description: deviceId (device mac address)
   *     type: string
   *     required: true
   */

  /**
   * @swagger
   * /api/devices:
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
  router.get('/', [AuthCheck()], (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    deviceProvider
      .getDevices(gws)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(stat.map(e => transformDevice(e)));
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * /api/devices/{deviceId}:
   *   parameters:
   *     - $ref: '#/parameters/deviceId'
   *   get:
   *     tags:
   *      - Devices
   *     description: Return the requested device
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           $ref: '#/definitions/Device'
   */
  router.get('/:deviceId', [AuthCheck()], (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    deviceProvider
      .getDevices(gws)
      .then((stat) => {
        if (stat.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(stat.map(e => transformDevice(e)));
        }
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
   * /api/devices/{deviceId}/command:
   *   parameters:
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
  router.post('/:deviceId/command', [AuthCheck(), validate(deviceCommandValidator)], (req, res) => {
    const reqDevice = req.params.deviceId;
    const ownedGws = req.user.app_metadata.gateways;

    if (ownedGws.indexOf(req.body.gateway) === -1) {
      res.sendStatus(401);
      return;
    }

    try {
      emitter.emit('event', { ...req.body, deviceId: reqDevice });
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500, e);
    }
  });

  return router;
}
