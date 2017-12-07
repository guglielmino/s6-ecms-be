import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";

import { FakeAuthMiddleware } from '../../../test-helper';
import HourlyStats from './';
import contentNegotiation from '../../../middleware/content-negotiation-middleware';

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
    app.use(contentNegotiation());

    request = supertest(app);
    const db = {
      collection: () => {
      },
    };
    hourlyStatsProvider = HourlyStatsProvider(db);
  });

  it('should get hourly stats for a given gateway', (done) => {
    let date = new Date();
    date = date.toISOString();
    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: { date, deviceId: '11:22:33:44:55:66' },
          gateway: 'test_gateway1',
          device: [{ deviceId: '11:22:33:44:55:66', name: 'test device' }],
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
          response[0].date.should.be.eq(date);
          response[0].deviceName.should.be.eq('test device');
          done();
        }
      });
  });

  it('should get hourly consume for a given deviceId', (done) => {
    const date = new Date();

    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStatByDevice')
      .returns(Promise.resolve(
        [{
          _id: 123,
          deviceId: '11:22:33:44:55:66',
          power: 20,
        }]),
    );

    HourlyStats(app, [FakeAuthMiddleware(['gwtest'])()], { hourlyStatsProvider });

    request
      .get(`/api/stats/hourly/11:22:33:44:55:66?gw=gwtest&date=${date}`)
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(sinon.match.any, ['gwtest'], '11:22:33:44:55:66')
            .should.be.true;
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].deviceId.should.be.eq('11:22:33:44:55:66');
          response[0].power.should.be.eq(20);
          done();
        }
      });
  })
});
