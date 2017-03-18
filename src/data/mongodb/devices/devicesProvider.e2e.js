import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import DevicesProvider from './devicesProvider';

chai.should();
const expect = chai.expect;

describe('devicesProvider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('devices', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should returns array of devices', (done) => {
    subject = DevicesProvider(db);

    subject.add({
      gateway: 'zara1',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: 'bb:36:41:9f:d1:ea',
      commands: {
        power: 'mqtt:cmnd/sonoff/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.getDevices(['zara1']))
      .then((res) => {
        res.length.should.be.eq(1);
        done();
      })
      .catch(err => done(err));
  });

  it('should return the device having the requested name in power command topic', (done) => {
    subject = DevicesProvider(db);

    subject.add({
      gateway: 'zara1',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: 'bb:36:41:9f:d1:ea',
      commands: {
        power: 'mqtt:cmnd/sonoff/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.findByPowerCommand('sonoff'))
      .then((res) => {
        res.commands.power.should.be.eq('mqtt:cmnd/sonoff/POWER');
        done();
      })
      .catch(err => done(err));
  });
});
