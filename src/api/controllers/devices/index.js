import _ from 'lodash';
import express from 'express';
import validate from 'express-validation';
import jsonpatch from 'fast-json-patch';
import emitter from '../../../streams/emitter';
import logger from '../../../common/logger';

import { transformDevice } from './deviceTransformer';
import transformDeviceValues from './deviceValuesTransformer';
import { getOverlapped, getHourlyDates } from '../../api-utils';

import deviceCommandValidator from './device.command.validation';
import devicePatchValidator from './device.patch.validation';

export default function (app, middlewares, { deviceProvider, deviceValuesProvider }) {
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
  router.get('/', middlewares, (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const limit = req.query.limit;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    deviceProvider
      .getDevices(gws, parseInt(limit, 10))
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

  router.get('/:deviceId/values', middlewares, (req, res) => {
    const deviceId = req.params.deviceId;
    const date = new Date(req.query.date);

    deviceValuesProvider.getDeviceValues(getHourlyDates(date), deviceId)
      .then((val) => {
        if (val.length === 0) {
          res.sendStatus(204);
        } else {
          res.sendData(val, {
            'application/json': d => d.map(s => transformDeviceValues(s)),
            'application/vnd.ms-excel': d => _.orderBy(d.map(s => transformDeviceValues(s)), 'date'),
          });
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });


  router.patch('/:deviceId', _.concat(middlewares, validate(devicePatchValidator)), (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const deviceId = req.params.deviceId;

    deviceProvider
      .findByDeviceId(deviceId)
      .then((dev) => {
        if (!dev) {
          return Promise.resolve(404);
        }

        if (ownedGws.indexOf(dev.gateway) === -1) {
          return Promise.resolve(403);
        }

        const newObj = jsonpatch.applyOperation(dev, req.body).newDocument;
        return deviceProvider
          .update(dev, newObj)
          .then(() => Promise.resolve(200));
      })
      .then(status => res.sendStatus(status))
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
  router.get('/:deviceId', middlewares, (req, res) => {
    const ownedGws = req.user.app_metadata.gateways;
    const deviceId = req.params.deviceId;

    deviceProvider
      .findByDeviceId(deviceId)
      .then((dev) => {
        if (!dev) {
          res.sendStatus(404);
          return;
        }
        if (ownedGws.indexOf(dev.gateway) === -1) {
          res.sendStatus(403);
        } else {
          res.json(transformDevice(dev));
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
  router.post('/:deviceId/command', _.concat(middlewares, validate(deviceCommandValidator)), (req, res) => {
    const reqDevice = req.params.deviceId;
    const ownedGws = req.user.app_metadata.gateways;

    if (ownedGws.indexOf(req.body.gateway) === -1) {
      res.sendStatus(403);
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
