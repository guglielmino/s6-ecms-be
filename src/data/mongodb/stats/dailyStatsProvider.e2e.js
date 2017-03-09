import chai from 'chai';
import sinon from 'sinon';

import {Database} from '../data';
import DailyStatsProvider from './dailyStatsProvider';

chai.should();
const expect = chai.expect;

describe('daily statistics provider', () => {
  let subject;

  it('should add stats data', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });

    database.connect()
      .then((db) => {
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
      })
      .catch(err => done(err));
  });

  it('should get all daily events', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });

    const todayDate = new Date();

    database.connect()
      .then((db) => {
        const value = Math.random();
        subject = DailyStatsProvider(db);
        subject
          .updateDailyStat({
            date: todayDate,
            gateway: 'test_gateway',
            today: 100,
          })
          .then(() => {
            return subject
              .getDailyStat(todayDate, 'test_gateway');
          })
          .then((res) => {
            res.length.should.be.gte(1);
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
});
