'use strict';

import express from 'express';
import config from '../../config'
import { getDate } from '../api-utils';
import { transformGateway } from './gatewayTransformer';

export default function (AuthCheck, RoleCheck, { gatewayProvider }) {

	const router = express.Router();

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
	 * /api/gateways/:
	 *   get:
	 *     tags:
	 *      - Gateways
	 *     description: Returns information about specified gateway
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
	router.get('/', [AuthCheck()], function (req, res) {
		const gateways = req.user.app_metadata.gateways;

		gatewayProvider
			.getGateways(gateways)
			.then(stat => {
				res.json(stat.map(s => transformGateway(s)));
			})
			.catch(err => { res.sendStatus(500); next(err); });
	});

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
	router.get('/:gateway', [AuthCheck()], function (req, res) {
		const gateways = req.user.app_metadata.gateways;
		const reqGateway = req.params.gateway;

		if (gateways.indexOf(reqGateway) == -1)
			res.sendStatus(204);

		gatewayProvider
			.getGateways(gateways)
			.then(stat => {
				res.json(stat.map(s => transformGateway(s)));
			})
			.catch(err => { res.sendStatus(500); next(err); });

	});



	return router;
}