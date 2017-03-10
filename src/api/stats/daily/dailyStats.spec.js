import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';

import { FakeAuthMiddleware } from '../../test-helper';
import DailyStats from './';

chai.should();
const expect = chai.expect;

describe('DailyStats API endpoints', () => {
  let request;
  let app;

  beforeEach(() => {
    app = express();
    request = supertest(app);
  });

  it('should returns daily stats for the given gateway', (done) => {
    const dailyStatsProvider = {};
    DailyStats(app, FakeAuthMiddleware(['gwtest']), null, { dailyStatsProvider });

    const date = new Date();

    dailyStatsProvider
      .getDailyStat = sinon
      .stub()
      .returns(Promise.resolve(
        [{
          _id: date,
          gateway: 'gwtest',
          today: 120.0,
        }]),
      );

    request
      .get('/api/stats/daily/gwtest')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].gateway.should.be.eq('gwtest');
          response[0].value.should.be.eq(120.0);
          response[0].date.should.be.eq(date.toJSON());
          done();
        }
      });
  });
});
