import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';

import GatewayAuth from '../../middleware/gateway-auth-middleware';
import Events from './';

import { EventsProvider } from '../../../data/mongodb';
import { FakeAuthMiddleware } from '../../test-helper';

chai.should();
const expect = chai.expect;

describe('Events API endpoints', () => {
  let request;
  let app;
  let eventProvider;

  beforeEach(() => {
    app = express();
    request = supertest(app);
    const db = {
      collection: () => {
      },
    };
    eventProvider = EventsProvider(db);
  });

  it('should call post for a result event', (done) => {
    Events(app, [GatewayAuth((a, b) => Promise.resolve(true))], { eventProvider });

    request
      .post('/api/events/')
      .set('x-s6-gatewayid', 'CASAFG')
      .set('x-s6-auth-token', '123455')
      .send({ name: 'a device' })
      .expect(201, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should return requested event', (done) => {
    sinon.stub(eventProvider, 'getLastEvent').returns(Promise.resolve({
      GatewayId: 'TESTGW',
      Type: 'TYPE',
      Payload: {
        deviceId: '123',
      },
    }));

    Events(app, [FakeAuthMiddleware(['TESTGW', 'gwtest2', 'gwtest3'])()], { eventProvider });
    request.get('/api/events?gw=TESTGW&types=TYPE,TYPE1&devId=123')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          console.log(eventProvider.getLastEvent.args);
          eventProvider.getLastEvent.calledWith('TESTGW', ['TYPE', 'TYPE1'], '123').should.equal(true);
          done();
        }
      });

  });
});
