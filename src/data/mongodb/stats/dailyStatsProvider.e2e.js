import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import DailyStatsProvider from './dailyStatsProvider';

chai.should();
const expect = chai.expect;

describe('daily statistics provider', () => {
  let subject;
  let db;

  beforeEach((done) => {

    ConnectDb('dailyStats', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should add stats data', (done) => {
    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: new Date(),
        gateway: 'test_gateway',
        today: value,
      })
      .then((res) => {
        res.should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should get daily stats for many gateways', (done) => {
    const todayDate = new Date();
    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        today: 100,
      })
      .then(() => {
        todayDate.setUTCHours(todayDate.getUTCHours() + 2);
        return subject
          .updateDailyStat({
            date: todayDate,
            gateway: 'test_gateway2',
            today: 25.4,
          });
      })
      .then(() => {
        return subject
          .getDailyStat(todayDate, ['test_gateway1', 'test_gateway2']);
      })
      .then((res) => {
        res.length.should.be.gte(1);
        res[0].today.should.be.eq(125.4);
        done();
      })
      .catch(err => done(err));
  });


  it('should get last daily compsumption', (done) => {
    const todayDate = new Date();

    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        today: 23.45,
      })
      .then(() => {
        todayDate.setUTCHours(todayDate.getUTCHours() + 2);
        return subject
          .updateDailyStat({
            date: todayDate,
            gateway: 'test_gateway1',
            today: 25.4,
          });
      })
      .then(() => {
        return subject
          .getDailyStat(todayDate, ['test_gateway1']);
      })
      .then((res) => {
        res.length.should.be.gte(1);
        res[0].today.should.be.eq(25.4);
        done();
      })
      .catch(err => done(err));
  });
});
