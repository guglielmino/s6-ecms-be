import _ from 'lodash';
import express from 'express';
import validate from 'express-validation';
import jsonpatch from 'fast-json-patch';
import logger from '../../../common/logger';
import deviceGroupsPatchValidator from './deviceGroups.patch.validation';
import { getOverlapped } from '../../api-utils';

import transformDeviceGroup from './deviceGroupsTransformer';

export default function (app, middlewares, { deviceGroupsProvider }) {
  const router = express.Router();

  app.use('/api/deviceGroups', router);

  /**
   * @swagger
   * definitions:
   *   DeviceGroup:
   *     properties:
   *       code:
   *         type: string
   *       description:
   *         type: string
   *       gateway:
   *         type: string
   */

  /**
   * @swagger
   * parameters:
   *   gateway:
   *     name: gateway
   *     in: query
   *     description: gateway
   *     type: string
   *     required: true
   */

  /**
   * @swagger
   * /api/deviceGroups:
   *   get:
   *     tags:
   *      - DeviceGroups
   *     description: Returns device groups belonging to the specified gateway
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: deviceGroups
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/DeviceGroup'
   */
  router.get('/', middlewares, (req, res) => {
    const appMetadata = req.user['https://ecms.smartsix.it/app_metadata'];
    const ownedGws = appMetadata.gateways;
    const reqGateways = req.query.gw;

    const gws = getOverlapped(ownedGws, reqGateways);

    deviceGroupsProvider
      .getGroups(gws)
      .then((deviceGroups) => {
        if (deviceGroups.length === 0) {
          res.sendStatus(204);
        } else {
          res.json(deviceGroups.map(e => transformDeviceGroup(e)));
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  /**
   * @swagger
   * parameters:
   *   deviceGroupCode:
   *     name: deviceGroupCode
   *     in: path
   *     description: code of device group to modify
   *     type: string
   *     required: true
   */

  /**
   * @swagger
   * /api/deviceGroups/{deviceGroupId}:
   *   get:
   *     tags:
   *      - DeviceGroups
   *     description: Modify specific field od requested deviceGroup
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: done
   */

  router.patch('/:deviceGroupCode', _.concat(middlewares, validate(deviceGroupsPatchValidator)), (req, res) => {
    const appMetadata = req.user['https://ecms.smartsix.it/app_metadata'];
    const ownedGws = appMetadata.gateways;
    const deviceGroupCode = req.params.deviceGroupCode;

    deviceGroupsProvider
      .getGroupByCode(deviceGroupCode)
      .then((dev) => {
        if (!dev) {
          return Promise.resolve(404);
        }

        if (ownedGws.indexOf(dev.gateway) === -1) {
          return Promise.resolve(403);
        }

        const newObj = jsonpatch.applyOperation(dev, req.body).newDocument;
        return deviceGroupsProvider
          .update(dev, newObj)
          .then(() => Promise.resolve(200));
      })
      .then(status => res.sendStatus(status))
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
