import chai from 'chai';
import sinon from 'sinon';

import {Database} from '../data';
import HourlyStatsProvider from './hourlyStatsProvider';

chai.should();
const expect = chai.expect;

describe('hourly statistics provider', () => {
  let subject;
  let db;

  beforeEach((done) => {

    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });

    database.connect()
      .then((_db) => {
        db = _db;
        db.collection('hourlyStats', (err, col) => {
          if (err) {
            done(err);
          }

          col.drop((err) => {
            if (err) {
              done(err);
            }
            else {

              done();
            }
          });
        });
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
    randomHourDate.setHours((Math.random() * 3));

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
            deviceId: '11:22:33:44:55:66',
            power: 10.0,
          });
      })
      .then((res) => {
        return subject
          .getHourlyStat(randomHourDate, ['test_gateway1', 'test_gateway2']);
      })
      .then((res) => {
      console.log(JSON.stringify(res));
        res[0].power.should.be.eq(30.0);
        res.length.should.be.eq(1);

        done();
      })
      .catch(err => done(err));
  });
});
