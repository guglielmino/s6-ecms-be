'use strict';

import expSetup from './express-setup';
import routes from  './routes';

export default function (config, providers) {
	const { host, port } = config.server;
	const app = expSetup();

	routes(app, providers);

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