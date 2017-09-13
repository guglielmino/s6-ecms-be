import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import contentNegotiation from './middleware/content-negotiation-middleware';

export default function () {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(contentNegotiation());

  return app;
}
