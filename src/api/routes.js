'use strict';

import config from '../config';
import JwtCheck from './middleware/auth-check-middleware';
import RoleCheck from './middleware/roles-middleware';

import Events from './events';
import Stats from './stats';
import HourlyStats from './stats/hourly';
import Gateways from './gateways';
import Devices from './devices';
import Alerts from './alerts';

module.exports = function(app, providers){
	const AuthCheck = JwtCheck(config.auth0);

	Events(app, AuthCheck, RoleCheck, providers);
	app.use('/api/stats/hourly', HourlyStats(AuthCheck, RoleCheck, providers));
	app.use('/api/stats', Stats(AuthCheck, RoleCheck, providers));
	app.use('/api/gateways', Gateways(AuthCheck, RoleCheck, providers));
	Devices(app, AuthCheck, RoleCheck, providers);
	app.use('/api/alerts', Alerts(AuthCheck, RoleCheck, providers));

};