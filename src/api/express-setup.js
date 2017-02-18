import express from 'express';
import cors from 'cors';
import config from '../config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';
var appData = require('../../package.json');

export default function () {
	const app = express();
	app.use(cors());

	var host = 'http://' + config.server.host + ':' + config.server.port;

	// Swagget API docs setup
	var swaggerDefinition = {
		info: {
			title: 'API documentation',
			version: appData.version,
			description: 'Endpoint documentation',
		},
		basePath: '/api',
	};

	var options = {
		// import swaggerDefinitions
		swaggerDefinition: swaggerDefinition,
		// path to the API docs
		apis: ['./src/api/alerts/index.js',
			'./src/api/devices/index.js',
			'./src/api/events/index.js',
			'./src/api/gateways/index.js',
			'./src/api/stats/index.js', './src/api/stats/hourly/index.js'],
	};


	var swaggerSpec = swaggerJSDoc(options);

	app.get('/api-docs.json', function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});

	swaggerTools.initializeMiddleware(swaggerSpec, function (middleware) {
		var options = {
			controllers: './',
			useStubs: false
		};

		app.use(middleware.swaggerMetadata());
		app.use(middleware.swaggerValidator());
		app.use(middleware.swaggerRouter(options));
		app.use(middleware.swaggerUi());

	});

	return app;
}
