'use strict';

import express from 'express';
import { getDate } from '../../api-utils';
import { transformHourlyStat } from './hourlyStatTransformer.js';

export default function (AuthCheck, RoleCheck, { eventProvider }) {

	const router = express.Router();

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