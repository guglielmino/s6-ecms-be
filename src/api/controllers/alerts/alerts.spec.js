import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';

import { FakeAuthMiddleware } from '../../test-helper';

import express from 'express';
import mockery from "mockery";

import { AlertsProvider } from '../../../data/mongodb/index';

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
      .get('/api/alerts/?gw=samplegw')
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

  it('should get alerts for some gateways', (done) => {
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
      .get('/api/alerts/?gw=samplegw&gw=testgw')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(['samplegw', 'testgw'])
            .should.be.true;
          done();
        }
      });
  });

  it('should responds 204 for not owned gateways', (done) => {
    Alerts(app, FakeAuthMiddleware(['samplegw', 'testgw']), null, { alertProvider });
    const stub = sinon.stub(alertProvider, 'getAlerts')
      .returns(Promise.resolve([]),
      );

    request
      .get('/api/alerts/?gw=first&gw=second')
      .expect(204, (err, res) => {
        if (err) {
          done(err);
        } else {
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

  it('should delete alert identifyed by id', (done) => {
    const stubGet = sinon.stub( alertProvider, 'getAlertById')
      .returns(Promise.resolve({
        gateway: 'samplegw',
        date: new Date(),
        deviceId: '00:11:22:33:44:55:66',
        message: 'an alert',
        read: false,
        id: '58c7b3e46b835bf90cfdffeb',
      }));

    const stubDelete = sinon.stub(alertProvider, 'deleteById').returns(true);

    Alerts(app, FakeAuthMiddleware(['samplegw']), null, { alertProvider });

    request
      .delete('/api/alerts/58c7b3e46b835bf90cfdffeb')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          expect(stubDelete.calledWith('58c7b3e46b835bf90cfdffeb'));
          done();
        }
      });
  });

  it('should return 403 trying to delete an alert of a wrong gateway', (done) => {
    const stubGet = sinon.stub( alertProvider, 'getAlertById')
      .returns(Promise.resolve({
        gateway: 'test',
        date: new Date(),
        deviceId: '00:11:22:33:44:55:66',
        message: 'an alert',
        read: false,
        id: '58c7b3e46b835bf90cfdffeb',
      }));

    Alerts(app, FakeAuthMiddleware(['samplegw']), null, { alertProvider });

    request
      .delete('/api/alerts/58c7b3e46b835bf90cfdffeb')
      .expect(403, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
