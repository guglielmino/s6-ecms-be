
import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';

import { FakeAuthMiddleware } from '../test-helper';
import Events from './';

chai.should();
const expect = chai.expect;

describe('Events API endpoints', () => {
  let request;
  let app;

  beforeEach(() => {
    app = express();
    request = supertest(app);
  });

  it('should returns events with required fields for the given gateway', (done) => {
    const eventProvider = {};
    Events(app, FakeAuthMiddleware(['gwtest']), null, { eventProvider });

    const date = new Date();

    eventProvider
      .getEvents = sinon
      .stub()
      .returns(Promise.resolve(
        [{
          Payload: {
            Yesterday: 12.3,
            Today: 8.4,
            Period: 2,
            Voltage: 225,
            Time: date,
          },
        }]),
      );

    request
      .get('/api/events/energy/gwtest')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].yesterday.should.be.eq(12.3);
          response[0].today.should.be.eq(8.4);
          response[0].period.should.be.eq(2);
          response[0].voltage.should.be.eq(225);
          response[0].time.should.be.eq(date.toJSON());
          done();
        }
      });
  });

  it('should returns 204 for a gateway not owned by the user', (done) => {
    const eventProvider = {};
    Events(app, FakeAuthMiddleware(['gwtest']), null, { eventProvider });
    eventProvider
      .getEvents = sinon
      .stub()
      .returns(Promise.resolve([]));

    request
      .get('/api/events/energy/agateway')
      .expect(204, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should call post for a result event', (done) => {
    const deviceProvider = {};
    Events(app, FakeAuthMiddleware(['samplegw']), null, { deviceProvider });

    request
      .post('/api/events/')
      .send({ name: 'a device' })
      .expect(201, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
