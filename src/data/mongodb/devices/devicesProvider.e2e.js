import chai from 'chai';
import sinon from 'sinon';

import {Database} from '../data';
import DevicesProvider from './devicesProvider';

chai.should();
const expect = chai.expect;

describe('devicesProvider', () => {
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
          done();
        })
        .catch(err => done(err));

    });

  it('should returns array of devices', (done) => {
    subject = DevicesProvider(db);
    subject
      .getDevices(['zara1'])
      .then((res) => {
        res.length.should.be.eq(2);
        done();
      })
      .catch(err => done(err));
  });

  it('should return the device having the requested name in power command topic', (done) => {
    subject = DevicesProvider(db);
    subject
      .findByPowerCommand('sonoff')
      .then((res) => {
        res.commands.length.should.be.eq(1);
        res.commands[0].power.should.be.eq('mqtt:cmnd/sonoff/POWER');
        done();
      })
      .catch(err => done(err));

  });
})
;
