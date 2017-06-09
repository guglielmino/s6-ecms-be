import chai from 'chai';
import sinon from 'sinon';
import LwtProcessor from './lwtProcessor';
import { DevicesProvider } from '../../data/mongodb';


chai.should();
const expect = chai.expect;

describe('LwtProcessor', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    subject = new LwtProcessor({ deviceProvider });

  });

  context('when event is LWT online', () => {
    it('should set device status Online = true', (done) => {
      const device = {
        gateway: 'gateway',
        swVersion: '1.2.2',
        deviceType: 'Sonoff Pow Module',
        deviceId: '12:22:44:1a:d6:fa',
        name: 'lamp3',
        commands: {
          power: 'mqtt:cmnd/sonoff/POWER',
        },
        created: new Date(),
      };

      sinon.stub(deviceProvider, 'updateByDeviceId').returns(Promise.resolve());

      sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(device));

      const event = {
        GatewayId: 'TESTGW',
        Type: 'LWT',
        Payload: {
          Topic: 'tele/lamp3/LWT',
          Status: 'Online',
          DeviceId: '12:22:44:1a:d6:fa',
        },
      };

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId.calledWith('12:22:44:1a:d6:fa').should.be.true;
          deviceProvider.updateByDeviceId.calledWith('12:22:44:1a:d6:fa', sinon.match({status: {online: true}})).should.be.true;
          done();
        })
        .catch(err => done(err));
    });
  });

  context('when event is LWT offline', () => {
    it('should set device status Online = true', (done) => {
      const device = {
        gateway: 'gateway',
        swVersion: '1.2.2',
        deviceType: 'Sonoff Pow Module',
        deviceId: '12:22:44:1a:d6:fa',
        name: 'lamp3',
        commands: {
          power: 'mqtt:cmnd/sonoff/POWER',
        },
        status: {},
        created: new Date(),
      };

      sinon.stub(deviceProvider, 'updateByDeviceId').returns(Promise.resolve());

      sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(device));

      const event = {
        GatewayId: 'TESTGW',
        Type: 'LWT',
        Payload: {
          Status: 'Offline',
          DeviceId: '12:22:44:1a:d6:fa',
        },
      };

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId.calledWith('12:22:44:1a:d6:fa').should.be.true;
          deviceProvider.updateByDeviceId.calledWith('12:22:44:1a:d6:fa', sinon.match({status: {online: false}})).should.be.true;
          done();
        })
        .catch(err => done(err));
    });
  });
});
