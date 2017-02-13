'use strict';

import express from 'express';
import config from '../../config';
import { transformEvent } from './eventTransformer';
import { getDate } from '../api-utils';


export default function (AuthCheck, RoleCheck, { eventProvider }) {

    const router = express.Router();

    router.get('/energy/:gateway', [AuthCheck()], function (req, res) {

        const date = getDate(req);
        const gateways = req.user.app_metadata.gateways;
        const reqGateway = req.params.gateway;

        if (gateways.indexOf(reqGateway) == -1)
            res.sendStatus(204);

        eventProvider
            .getEvents([reqGateway], date)
            .then(stat => {
                res.json(stat.map(e => transformEvent(e)));
            })
            .catch(err => { res.sendStatus(500); next(err); });

    });

    router.get('/energy/', [AuthCheck()], function (req, res, next) {
        const date = getDate(req);
        const gateways = req.user.app_metadata.gateways;

        eventProvider
            .getEvents(gateways, date)
            .then(stat => {
                res.json(stat.map(e => transformEvent(e)));
            })
            .catch(err => { res.sendStatus(500); next(err); });
    });

    return router;
}