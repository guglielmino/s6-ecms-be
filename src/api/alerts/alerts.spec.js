import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';

import { FakeAuthMiddleware } from '../test-helper';

import express from 'express';
import mockery from "mockery";

import { AlertsProvider } from '../../data/mongodb';

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
  let alertProvider = {};


  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    Alerts = require('./index').default;
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);
    alertProvider = AlertsProvider({});
  });

  it('should get alerts for a passed gateway', (done) => {
    Alerts(app, FakeAuthMiddleware(['samplegw', 'testgw']), null, { alertProvider });
    const stub = sinon.stub(alertProvider, 'getAlerts')
      .returns(Promise.resolve([{
          gateway: 'samplegw',
          date: new Date(),
          deviceId: '00:11:22:33:44:55:66',
          message: 'an alert',
          read: false,
          id: '58c7b3e46b835bf90cfdffeb',
        }]),
      );

    request
      .get('/api/alerts/samplegw')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(['samplegw'])
            .should.be.true;
          done();
        }
      });
  });

  it('should toggle read field', (done) => {
    const stub = sinon.stub( alertProvider, 'getAlertById')
      .returns(Promise.resolve({
        gateway: 'samplegw',
        date: new Date(),
        deviceId: '00:11:22:33:44:55:66',
        message: 'an alert',
        read: false,
        id: '58c7b3e46b835bf90cfdffeb',
      }));

    const stubUpdate = sinon.stub(alertProvider, 'updateById').returns({
      status: true,
    });

    Alerts(app, FakeAuthMiddleware(['samplegw']), null, { alertProvider });

    request
      .put('/api/alerts/58c7b3e46b835bf90cfdffeb/read')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          expect(stubUpdate.calledWith(sinon.match({ read: true })));
          done();
        }
      });
  });
});
