'use strict';

export default function (config, app) {
	const { host, port } = config.server;

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