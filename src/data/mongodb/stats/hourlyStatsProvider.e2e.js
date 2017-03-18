import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import HourlyStatsProvider from './hourlyStatsProvider';

chai.should();
const expect = chai.expect;

describe('hourly statistics provider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('hourlyStats', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should add stats data', (done) => {
    const randomHourDate = new Date();
    randomHourDate.setHours((Math.random() * 3));

    const value = Math.random();
    subject = HourlyStatsProvider(db);
    subject
      .updateHourlyStat({
        date: randomHourDate,
        gateway: 'test_gateway',
        deviceId: '11:22:33:44:55:66',
        power: 12.3,
      })
      .then((res) => {
        res.should.be.true;
        done();
      })
      .catch(err => done(err));

  });

  it('should get stats of today', (done) => {
    const randomHourDate = new Date();

    const value = Math.random();
    subject = HourlyStatsProvider(db);
    subject
      .updateHourlyStat({
        date: randomHourDate,
        gateway: 'test_gateway1',
        deviceId: '11:22:33:44:55:66',
        power: 20.0,
      })
      .then(() => {
        return subject
          .updateHourlyStat({
            date: randomHourDate,
            gateway: 'test_gateway2',
            deviceId: '11:22:33:44:44:66',
            power: 10.0,
          });
      })
      .then((res) => {
        return subject
          .getHourlyStat([randomHourDate], ['test_gateway1', 'test_gateway2']);
      })
      .then((res) => {
        res[0].power.should.be.eq(30.0);
        res.length.should.be.eq(1);

        done();
      })
      .catch(err => done(err));
  });

  it('should get stats array for hours of today', (done) => {
    const randomHourDate = new Date();
    const datePlusOneHour = new Date(randomHourDate);
    datePlusOneHour.setHours(datePlusOneHour.getHours() + 1);

    const value = Math.random();
    subject = HourlyStatsProvider(db);
    subject
      .updateHourlyStat({
        date: randomHourDate,
        gateway: 'test_gateway1',
        deviceId: '11:22:33:44:55:66',
        power: 20.0,
      })
      .then(() => {
        return subject
          .updateHourlyStat({
            date: datePlusOneHour,
            gateway: 'test_gateway1',
            deviceId: '11:22:33:44:44:66',
            power: 10.0,
          });
      })
      .then((res) => {
        return subject
          .getHourlyStat([randomHourDate, datePlusOneHour], ['test_gateway1']);
      })
      .then((res) => {

        res.length.should.be.eq(2);
        res[0].power.should.be.eq(10.0);
        res[1].power.should.be.eq(20.0);
        done();
      })
      .catch(err => done(err));
  });
});
