import express from 'express';
import logger from '../../common/logger';
import { transformGateway } from './gatewayTransformer';

export default function (app, AuthCheck, RoleCheck, { gatewayProvider }) {
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
   *           type: array
   *           items:
   *             $ref: '#/definitions/Gateway'
   */
  router.get('/:gateway', [AuthCheck()], (req, res) => {
    const gateways = req.user.app_metadata.gateways;
    const reqGateway = req.params.gateway;

    if (gateways.indexOf(reqGateway) === -1) {
      res.sendStatus(204);
      return;
    }

    gatewayProvider
      .getGateways(gateways)
      .then((stat) => {
        res.json(stat.map(s => transformGateway(s)));
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });

  return router;
}
