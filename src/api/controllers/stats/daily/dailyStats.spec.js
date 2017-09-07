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

const addDaysToDate = (date, days) => {
  const current = new Date(date);
  let newDate = current;
  newDate.setDate(current.getDate() + days);
  newDate = new Date(newDate);
  return newDate;
};


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

    DailyStats(app, [FakeAuthMiddleware(['gwtest'])()], { dailyStatsProvider });

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

  it('should return daily stats for given range of dates', (done) => {
    const date = new Date();
    const toDate = addDaysToDate(date, 5);

    const stub = sinon.stub(dailyStatsProvider, 'getDailyStat')
      .returns(Promise.resolve(
        [{
          _id: date,
          gateway: 'gwtest',
          today: 120.0,
        },
        {
          _id: addDaysToDate(date, 1),
          gateway: 'gwtest',
          today: 10.0,
        }]),
      );

    DailyStats(app, [FakeAuthMiddleware(['gwtest'])()], { dailyStatsProvider });

    request
      .get(`/api/stats/daily/?gw=gwtest&fromDate=${date}&toDate=${toDate}`)
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.calledWith(sinon.match.any, ['gwtest'])
            .should.be.true;

          const response = res.body;
          response.length.should.be.eq(2);
          response[0].gateway.should.be.eq('gwtest');
          response[0].value.should.be.eq(120.0);
          response[0].date.should.be.eq(date.toJSON());

          response[1].gateway.should.be.eq('gwtest');
          response[1].value.should.be.eq(10.0);
          response[1].date.should.be.eq(addDaysToDate(date, 1).toJSON());

          done();
        }
      });
  });
});
