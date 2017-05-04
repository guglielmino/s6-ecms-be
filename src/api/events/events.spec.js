
import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';

import { FakeAuthMiddleware } from '../test-helper';
import Events from './';

import { EventsProvider } from '../../data/mongodb';

chai.should();
const expect = chai.expect;

describe('Events API endpoints', () => {
  let request;
  let app;
  let eventProvider;

  beforeEach(() => {
    app = express();
    request = supertest(app);
    eventProvider = EventsProvider({});
  });

  it('should call post for a result event', (done) => {
    Events(app, FakeAuthMiddleware(['samplegw']), null, { eventProvider });

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
