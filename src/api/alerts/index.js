'use strict';

import express from 'express';
import config from '../../config';
import { transformAlert } from './alertTransformer';
import { getDate } from '../api-utils';


export default function (AuthCheck, RoleCheck, { alertProvider }) {

	const router = express.Router();

	/**
	 * @swagger
	 * definitions:
	 *   Alert:
	 *     properties:
	 *       gateway:
	 *         type: string
	 *       date:
	 *         type: string
	 *       deviceId:
	 *         type: string
	 *       message:
	 *         type: string
	 *       read:
	 *         type: string
   */


	/**
	 * @swagger
	 * /api/alerts:
	 *   get:
	 *     tags:
	 *      - Alerts
	 *     description: Returns alerts for the devices belonging to requesting user
	 *     produces:
	 *      - application/json
	 *     responses:
	 *       200:
	 *         description: alerts
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/Alert'
	 */
	router.get('/', [AuthCheck()], function (req, res) {

		const date = getDate(req);
		const gateways = req.user.app_metadata.gateways;

		alertProvider
			.getAlerts(gateways)
			.then(ev => {
				res.json(ev.map(e => transformAlert(e)));
			})
			.catch(err => { res.sendStatus(500); next(err); });
	});


	return router;
}