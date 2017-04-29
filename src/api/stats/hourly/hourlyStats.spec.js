import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";

import { FakeAuthMiddleware } from '../../test-helper';
import HourlyStats from './';

import { HourlyStatsProvider } from '../../../data/mongodb';

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});


describe('DailyStats API endpoints', () => {
  let request;
  let app;
  let hourlyStatsProvider;

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    app = express();
    request = supertest(app);
    const db = {
      collection: () => {
      },
    };
    hourlyStatsProvider = HourlyStatsProvider(db);
  });

  it('should get hourly stats', (done) => {
    const date = new Date();
    sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: 12,
          date: Date.parse('2017-03-16T12:00:00.000Z'),
          deviceId: '11:22:33:44:55:66',
          gateway: 'test_gateway1',
          power: 20,
        }]),
      );

    HourlyStats(app, FakeAuthMiddleware(['gwtest']), null, { hourlyStatsProvider });

    request
      .get('/api/stats/hourly/')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].deviceId.should.be.eq('11:22:33:44:55:66');
          response[0].power.should.be.eq(20);
          response[0].hour.should.be.eq(12);
          done();
        }
      });
  });
});
