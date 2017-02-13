'use strict';

import express from 'express';
import config from '../../config';
import { transformAlert } from './alertTransformer';
import { getDate } from '../api-utils';


export default function (AuthCheck, RoleCheck, { alertProvider }) {

	const router = express.Router();

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