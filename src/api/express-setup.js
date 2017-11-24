import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import contentNegotiation from './middleware/content-negotiation-middleware';
import queryStringPaging from './middleware/query-string-paging-middleware';

export default function () {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(contentNegotiation());
  app.use(queryStringPaging());

  return app;
}
