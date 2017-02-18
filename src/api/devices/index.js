'use strict';

import express from 'express';
import config from '../../config';
import { transformDevice } from './deviceTransformer';
import { getDate } from '../api-utils';


export default function (AuthCheck, RoleCheck, { deviceProvider }) {

	const router = express.Router();

	/**
	 * @swagger
	 * definitions:
	 *   Device:
	 *     properties:
	 *       name:
	 *         type: string
	 *       deviceId:
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
	router.get('/:gateway', [AuthCheck()], function (req, res) {

		const date = getDate(req);
		const gateways = req.user.app_metadata.gateways;
		const reqGateway = req.params.gateway;

		if (gateways.indexOf(reqGateway) == -1)
			res.sendStatus(204);

		deviceProvider
			.getDevices([reqGateway])
			.then(stat => {
				res.json(stat.map(e => transformDevice(e)));
			})
			.catch(err => { res.sendStatus(500); next(err); });

	});



	return router;
}