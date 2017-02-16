'use strict';

import express from 'express';
import config from '../../config'
import { getDate } from '../api-utils';
import { transformStat } from './statTransformer';

export default function (AuthCheck, RoleCheck, { eventProvider }) {

    const router = express.Router();

    router.get('/energy/:gateway', [AuthCheck()], function (req, res) {
        const date = getDate(req);
        const gateways = req.user.app_metadata.gateways;
        const reqGateway = req.params.gateway;
        const hourly = req.query.hourly;

        if(gateways.indexOf(reqGateway) == -1) 
            res.sendStatus(204);

        eventProvider
            .getEnergyStats([reqGateway], date, hourly || false)
            .then(stat => {
                res.json(stat.map(s => transformStat(s)));
            })
            .catch(err => { res.sendStatus(500); next(err); });

    });

    router.get('/energy/', [AuthCheck()], function (req, res) {
        const date = getDate(req);
        const gateways = req.user.app_metadata.gateways;
			  const hourly = req.query.hourly;
        console.log(`calling with ${gateways} ${date}`);

        eventProvider
            .getEnergyStats(gateways, date, hourly || false)
            .then(stat => {
                res.json(stat.map(s => transformStat(s)));
            })
            .catch(err => { console.log(err); res.sendStatus(500); next(err); });
    });



    return router;
}