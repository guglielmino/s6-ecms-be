'use strict';

import expSetup from './express-setup';

import JwtCheck from './middleware/auth-check-middleware';
import RoleCheck from './middleware/roles-middleware';


import Events from './events';
import Stats from './stats';
import Gateways from './gateways';
import Devices from './devices';
import Alerts from './alerts';

export default function (config, providers) {
    const { host, port } = config.server;
    const app = expSetup();

     // Authentication middleware provided by express-jwt
    const AuthCheck = JwtCheck(config.auth0);

    // API routes
    app.use('/api/events', Events(AuthCheck, RoleCheck, providers));
    app.use('/api/stats', Stats(AuthCheck, RoleCheck, providers));
	  app.use('/api/gateways', Gateways(AuthCheck, RoleCheck, providers));
	  app.use('/api/devices', Devices(AuthCheck, RoleCheck, providers));
		app.use('/api/alerts', Alerts(AuthCheck, RoleCheck, providers));

    // Default error handler
    app.use(function (err, req, res, next) {
        console.log("API error " + err);
			  res.sendStatus(500);
			  next();
    });

   
    const server = require('http').createServer(app);
    server.listen(port);
    console.log(`Listening on http://${host}:${port}`);
    return server;
}