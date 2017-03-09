import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import HourlyStatsProvider from './hourlyStatsProvider';

chai.should();
const expect = chai.expect;

describe('hourly statistics provider', () => {
  let subject;

  it('should add stats data', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });

    const randomHourDate = new Date();
    randomHourDate.setHours((Math.random() * 3));
    console.log(`randome hour ${randomHourDate}`);

    database.connect()
      .then((db) => {
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
      })
      .catch(err => done(err));
  });
});
