import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";

import { FakeAuthMiddleware } from '../../../test-helper';
import HourlyStats from './';

import { HourlyStatsProvider } from '../../../../data/mongodb';

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});


describe('HourlyStats API endpoints', () => {
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

  it('should get hourly stats for a given gateway', (done) => {
    const date = new Date();
    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: { hour: 12, deviceId: '11:22:33:44:55:66' },
          date: Date.parse('2017-03-16T12:00:00.000Z'),
          gateway: 'test_gateway1',
          power: 20,
        }]),
    );

    HourlyStats(app, [FakeAuthMiddleware(['gwtest'])()], { hourlyStatsProvider });

    request
      .get('/api/stats/hourly?gw=gwtest')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(sinon.match.any, ['gwtest'])
            .should.be.true;

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
