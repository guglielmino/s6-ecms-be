import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';

import {FakeAuthMiddleware} from '../test-helper';

import express from 'express';
import mockery from "mockery";

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});

describe('Alerts API endpoints', () => {
  let request;
  let app;
  let Alerts;

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    Alerts = require('./index').default;
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);
  });

  it('should get alerts for a passed gateway', (done) => {
    const alertProvider = {};
    Alerts(app, FakeAuthMiddleware(['samplegw']), null, { alertProvider });

    alertProvider
      .getAlerts = sinon
      .stub()
      .returns(Promise.resolve([{
          gateway: 'samplegw',
          date: new Date(),
          deviceId: '00:11:22:33:44:55:66',
          message: 'an alert',
          read: false,
        }]),
      );

    request
      .get('/api/alerts/samplegw')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
