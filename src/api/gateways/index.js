'use strict';

import express from 'express';
import config from '../../config'
import { getDate } from '../api-utils';
import { transformGateway } from './gatewayTransformer';

export default function (AuthCheck, RoleCheck, { gatewayProvider }) {

	const router = express.Router();

	router.get('/', [AuthCheck()], function (req, res) {
		const gateways = req.user.app_metadata.gateways;

		gatewayProvider
			.getGateways(gateways)
			.then(stat => {
				res.json(stat.map(s => transformGateway(s)));
			})
			.catch(err => { res.sendStatus(500); next(err); });
	});

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