import chai, { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";

import { FakeAuthMiddleware } from '../../../test-helper';
import HourlyStats from './';
import contentNegotiation from '../../../middleware/content-negotiation-middleware';
import * as apiUtils from '../../../api-utils';

chai.should();

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

    hourlyStatsProvider = {
      getHourlyStat: () => { },
      getHourlyStatByDevice: () => {},
    };
  });

  it('should get hourly stats for a given gateway', (done) => {
    let date = new Date();
    date = date.toISOString();
    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: { date, deviceId: '11:22:33:44:55:66' },
          gateway: 'test_gateway1',
          device: [{ deviceId: '11:22:33:44:55:66', description: 'test device' }],
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
  });

  it('should get hourly consume for given date', (done) => {
    const date = new Date();
    const getDateStub = sinon.stub(apiUtils, 'getHourlyDates').returns(['0', '1', '2']);

    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: 123,
          deviceId: '11:22:33:44:55:66',
          power: 20,
        }]),
      );

    HourlyStats(app, [FakeAuthMiddleware(['gwtest'])()], { hourlyStatsProvider });

    request
      .get(`/api/stats/hourly?gw=gwtest&date=${date.toUTCString()}`)
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          expect(stub.calledWith(['0', '1', '2'], ['gwtest'], null)).to.eq(true);
          expect(getDateStub.called).to.be.eq(true);
          expect(getDateStub.firstCall.args[0].toUTCString()).to.be.eq(date.toUTCString());

          const response = res.body;
          response.length.should.be.eq(1);
          response[0].deviceId.should.be.eq('11:22:33:44:55:66');
          response[0].power.should.be.eq(20);
          done();
        }
      });
  });

  it('should get hourly consume for range date', (done) => {
    const fromDate = new Date();
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);

    const getDateStub = sinon.stub(apiUtils, 'getHoursBetweenDates').returns(['3', '6', '4']);

    const stub = sinon.stub(hourlyStatsProvider, 'getHourlyStat')
      .returns(Promise.resolve(
        [{
          _id: 123,
          deviceId: '11:22:33:44:55:66',
          power: 20,
        }]),
      );

    HourlyStats(app, [FakeAuthMiddleware(['gwtest'])()], { hourlyStatsProvider });

    request
      .get(`/api/stats/hourly?gw=gwtest&fromDate=${fromDate.toUTCString()}&toDate=${toDate.toUTCString()}`)
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(['3', '6', '4'], ['gwtest'], null)
            .should.be.true;
          expect(getDateStub.called).to.be.eq(true);
          expect(getDateStub.calledWith(fromDate.toUTCString(), toDate.toUTCString())).to.be.eq(true);

          const response = res.body;
          response.length.should.be.eq(1);
          response[0].deviceId.should.be.eq('11:22:33:44:55:66');
          response[0].power.should.be.eq(20);
          done();
        }
      });
  });
});
