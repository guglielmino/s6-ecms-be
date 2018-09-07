import express from 'express';
import validate from 'express-validation';
import jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';
import gatewayPatchValidator from './gateway.patch.validation';
import logger from '../../../common/logger';
import { transformGateway } from './gatewayTransformer';

export default function (app, middlewares, { gatewayProvider }) {
  const router = express.Router();

  app.use('/api/gateways', router);

  /**
   * @swagger
   * definitions:
   *   Gateway:
   *     properties:
   *       code:
   *         type: string
   *       description:
   *         type: number
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
   * /api/gateways/{gateway}:
   *   parameters:
   *     - $ref: '#/parameters/gateway'
   *   get:
   *     tags:
   *      - Gateways
   *     description: Returns gateways list belonging to current user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: alerts
   *         schema:
   *           $ref: '#/definitions/Gateway'
   */
  router.get('/:gateway', middlewares, (req, res) => {
    const appMetadata = req.user['https://ecms.smartsix.it/app_metadata'];
    const gateways = appMetadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    gatewayProvider
      .getGateways([reqGateway])
      .then((stat) => {
        res.json(stat.map(s => transformGateway(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  router.patch('/:gateway', _.concat(middlewares, validate(gatewayPatchValidator)), (req, res) => {
    const appMetadata = req.user['https://ecms.smartsix.it/app_metadata'];
    const ownedGateways = appMetadata.gateways;
    const gateway = req.params.gateway;

    if (ownedGateways.indexOf(gateway) === -1) {
      res.sendStatus(204);
      return;
    }

    gatewayProvider.getGateway(gateway)
      .then((gtw) => {
        if (!gtw) {
          return Promise.resolve(404);
        }
        const newObj = jsonpatch.applyOperation(gtw, req.body).newDocument;
        return gatewayProvider
        .updateByGatewayCode(gateway, newObj)
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
