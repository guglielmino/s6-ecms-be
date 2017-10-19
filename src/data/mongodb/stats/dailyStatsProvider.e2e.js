import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import DailyStatsProvider from './dailyStatsProvider';

chai.should();
const expect = chai.expect;

const addDaysToDate = (date, days) => {
  const current = new Date(date);
  let newDate = current;
  newDate.setDate(current.getDate() + days);
  newDate = new Date(newDate);
  return newDate;
};

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
        deviceId: '00:11:22:33:44:55',
        today: value,
      })
      .then((res) => {
        res.should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should throws if deviceId is missing', (done) => {
    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: new Date(),
        gateway: 'test_gateway',
        today: value,
      })
      .then((res) => {
        done(new Error('Should not complete'));
      })
      .catch((err) => {
        err.should.be.not.null;
        done();
      });
  });

  it('should get daily stats for many gateways and devices', (done) => {
    const todayDate = new Date();
    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        deviceId: '00:11:22:33:44:55',
        today: 100,
      })
      .then(() => {
        todayDate.setUTCHours(todayDate.getUTCHours() + 2);
        return subject
          .updateDailyStat({
            date: todayDate,
            gateway: 'test_gateway2',
            deviceId: '66:55:44:33:22:11',
            today: 25.4,
          });
      })
      .then(() => subject
          .getDailyStat(todayDate, ['test_gateway1', 'test_gateway2']))
      .then((res) => {
        res.length.should.be.gte(1);
        res[0].today.should.be.eq(125.4);
        done();
      })
      .catch(err => done(err));
  });


  it('should get last daily compsumption for one gateway, on device and multiple events', (done) => {
    const todayDate = new Date();

    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        deviceId: '00:11:22:33:44:55',
        today: 23.45,
      })
      .then(() => {
        todayDate.setUTCHours(todayDate.getUTCHours() + 2);
        return subject
          .updateDailyStat({
            date: todayDate,
            gateway: 'test_gateway1',
            deviceId: '00:11:22:33:44:55',
            today: 25.4,
          });
      })
      .then(() => subject
          .getDailyStat(todayDate, ['test_gateway1']))
      .then((res) => {
        res.length.should.be.gte(1);
        res[0].today.should.be.eq(25.4);
        done();
      })
      .catch(err => done(err));
  });

  it('should get daily stats for range of date', (done) => {
    const todayDate = new Date();
    const value = Math.random();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        deviceId: '00:11:22:33:44:55',
        today: 23.45,
      })
      .then(() => subject
          .updateDailyStat({
            date: addDaysToDate(todayDate, 2),
            gateway: 'test_gateway1',
            deviceId: '00:11:22:33:44:55',
            today: 10.3,
          }))
      .then(() => subject
          .updateDailyStat({
            date: addDaysToDate(todayDate, 5),
            gateway: 'test_gateway1',
            deviceId: '00:11:22:33:44:55',
            today: 35.2,
          }))
      .then(() => {
        const date = new Date();
        const toDate = addDaysToDate(date, 3);
        return subject
          .getDailyStat([date, toDate], ['test_gateway1']);
      })
      .then((res) => {
        res.length.should.be.equal(2);
        res[0].today.should.be.eq(10.3);
        res[1].today.should.be.eq(23.45);
        done();
      })
      .catch(err => done(err));
  });

  it('should get daily stats for given date and deviceId', (done) => {
    const todayDate = new Date();
    subject = DailyStatsProvider(db);
    subject
      .updateDailyStat({
        date: todayDate,
        gateway: 'test_gateway1',
        deviceId: '00:11:22:33:44:55',
        today: 23.45,
      })
      .then(() => subject
          .updateDailyStat({
            date: addDaysToDate(todayDate, 2),
            gateway: 'test_gateway1',
            deviceId: '00:11:22:33:44:55',
            today: 10.3,
          }))
      .then(() => subject
          .updateDailyStat({
            date: addDaysToDate(todayDate, 5),
            gateway: 'test_gateway1',
            deviceId: '00:11:22:33:44:55',
            today: 35.2,
          }))
      .then(() => subject
          .getDailyStatsForDeviceId(todayDate, '00:11:22:33:44:55'))
      .then((res) => {
        res.today.should.be.eq(23.45);
        res.deviceId.should.be.eq('00:11:22:33:44:55');
        done();
      })
      .catch(err => done(err));
  });
});
