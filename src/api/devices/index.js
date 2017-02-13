'use strict';

import express from 'express';
import config from '../../config';
import { transformDevice } from './deviceTransformer';
import { getDate } from '../api-utils';


export default function (AuthCheck, RoleCheck, { deviceProvider }) {

	const router = express.Router();

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