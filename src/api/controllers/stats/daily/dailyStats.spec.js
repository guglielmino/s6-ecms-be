import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";

import { FakeAuthMiddleware } from '../../../test-helper';
import DailyStats from './';

import { DailyStatsProvider } from '../../../../data/mongodb';

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});


describe('DailyStats API endpoints', () => {
  let request;
  let app;
  let dailyStatsProvider;

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    app = express();
    request = supertest(app);
    const db = {
      collection: () => {
      }
    };
    dailyStatsProvider = DailyStatsProvider(db);
  });

  it('should returns daily stats for the given gateway', (done) => {
    const date = new Date();
    const stub = sinon.stub(dailyStatsProvider, 'getDailyStat')
      .returns(Promise.resolve(
        [{
          _id: date,
          gateway: 'gwtest',
          today: 120.0,
        }]),
      );

    DailyStats(app, FakeAuthMiddleware(['gwtest']), null, { dailyStatsProvider });

    request
      .get('/api/stats/daily/?gw=gwtest')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(sinon.match.any, ['gwtest'])
            .should.be.true;

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
