import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
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
      name: 'sample',
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

  it('should return the device having the requested command and value', (done) => {
    subject = DevicesProvider(db);

    subject.add({
      gateway: 'zara1',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: 'bb:36:41:9f:d1:ea',
      name: 'sample',
      commands: {
        power: 'mqtt:cmnd/test2/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.findByCommand('power', 'mqtt:cmnd/test2/POWER'))
      .then((res) => {
        res.commands.power.should.be.eq('mqtt:cmnd/test2/POWER');
        done();
      })
      .catch(err => done(err));
  });

  it('should create a device if doesn\'t exists', (done) => {

    subject = DevicesProvider(db);

    subject.updateById(new ObjectID(), {
      gateway: 'agateway',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: '11:44:41:9f:66:ea',
      name: 'UpsertDevice',
      commands: {
        power: 'mqtt:cmnd/test6/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.getDevices(['agateway']))
      .then((res) => {
        res.length.should.be.eq(1);
        res[0].name.should.be.eq('UpsertDevice');
        done();
      })
      .catch(err => done(err));
  });

  it('should update device after creating it', (done) => {

    subject = DevicesProvider(db);

    subject.updateByDeviceId('11:44:41:9f:66:ea', {
      gateway: 'agateway',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: '11:44:41:9f:66:ea',
      name: 'UpsertDevice',
      commands: {
        power: 'mqtt:cmnd/test6/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.getById(res.id))
      .then(res => subject.updateByDeviceId(res.deviceId, {
        gateway: 'agateway',
        swVersion: '1.2.3',
        deviceType: 'Sonoff Pow Module',
        deviceId: '11:44:41:9f:66:ea',
        name: 'UpsertDeviceUpdated',
        commands: {
          power: 'mqtt:cmnd/test6/POWER',
        },
        created: new Date(),
      }))
      .then(res => subject.getById(res.id))
      .then((res) => {
        res.name.should.be.eq('UpsertDeviceUpdated');
        done();
      })
      .catch(err => done(err));
  });

  it('should get device by entity id', (done) => {
    subject = DevicesProvider(db);

    subject.add({
      gateway: 'samplegw',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: '12:34:55:6a:d1:ea',
      name: 'sample',
      commands: {
        power: 'mqtt:cmnd/sonoff/POWER',
      },
      created: new Date(),
    })
      .then(res => subject.getById(res.id))
      .then((device) => {
        device.name.should.be.eq('sample');
        device.deviceId.should.be.eq('12:34:55:6a:d1:ea');
        done();
      })
      .catch(err => done(err));
  });


});
