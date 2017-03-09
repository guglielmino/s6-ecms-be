
import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import StatsProvider from './statsProvider';

chai.should();
const expect = chai.expect;

describe('statsProvider', () => {
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
        subject = StatsProvider(db);
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
});
