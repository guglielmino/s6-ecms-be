'use strict';

import express from 'express';
import { getDate } from '../../api-utils';
import { transformHourlyStat } from './hourlyStatTransformer.js';

export default function (AuthCheck, RoleCheck, { eventProvider }) {

	const router = express.Router();

	/**
	 * @swagger
	 * definitions:
	 *   HourlyStat:
	 *     properties:
	 *       current:
	 *         type: number
	 *       power:
	 *         type: number
	 *       hour:
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
	 * /api/stats/hourly/energy/{gateway}:
	 *   parameters:
	 *     - $ref: '#/parameters/gateway'
	 *   get:
	 *     tags:
	 *      - Stats
	 *     description: Returns hourly stats about day consumption of devices belonging to gateway
	 *     parameters:
	 *      - name: date
	 *        description: requested stats date
	 *        type: string
	 *        in: query
	 *     produces:
	 *      - application/json
	 *     responses:
	 *       200:
	 *         description: alerts
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/HourlyStat'
	 */
	router.get('/energy/:gateway', [AuthCheck()], function (req, res) {
		const date = getDate(req);
		const gateways = req.user.app_metadata.gateways;
		const reqGateway = req.params.gateway;

		if(gateways.indexOf(reqGateway) == -1)
			res.sendStatus(204);

		eventProvider
			.getEnergyStats([reqGateway], date, true)
			.then(stat => {
				res.json(stat.map(s => transformHourlyStat(s)));
			})
			.catch(err => { res.sendStatus(500); next(err); });

	});

	/**
	 * @swagger
	 * /api/stats/hourly/energy/{gateway}:
	 *   get:
	 *     tags:
	 *      - Stats
	 *     description: Returns hourly stats about day consumption for all user gateways
	 *     parameters:
	 *      - name: date
	 *        description: requested stats date
	 *        type: string
	 *        in: query
	 *     produces:
	 *      - application/json
	 *     responses:
	 *       200:
	 *         description: alerts
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/HourlyStat'
	 */
	router.get('/energy/', [AuthCheck()], function (req, res) {
		const date = getDate(req);
		const gateways = req.user.app_metadata.gateways;

		eventProvider
			.getEnergyStats(gateways, date, true)
			.then(stat => {
				res.json(stat.map(s => transformHourlyStat(s)));
			})
			.catch(err => { console.log(err); res.sendStatus(500); next(err); });
	});



	return router;
}