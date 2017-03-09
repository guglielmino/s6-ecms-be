

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';

const appData = require('../../package.json');

export default function (app) {
  const swaggerDefinition = {
    info: {
      title: 'API documentation',
      version: appData.version,
      description: 'Endpoint documentation',
    },
    basePath: '/api',
  };

  const options = {
    swaggerDefinition,
    apis: ['./src/api/alerts/index.js',
      './src/api/devices/index.js',
      './src/api/events/index.js',
      './src/api/gateways/index.js',
      './src/api/stats/hourly/index.js',
      './src/api/stats/daily/index.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  swaggerTools.initializeMiddleware(swaggerSpec, (middleware) => {
    const opts = {
      controllers: './',
      useStubs: false,
    };

    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerRouter(opts));
    app.use(middleware.swaggerUi());
  });
}
