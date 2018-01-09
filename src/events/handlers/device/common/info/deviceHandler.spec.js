import chai from 'chai';
import sinon from 'sinon';
import DeviceHandler from './deviceHandler';
import helper from '../../../processor_tests_helper.spec';

helper('./deviceProcessor');

chai.should();
const expect = chai.expect;

describe('DeviceHandler', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    deviceProvider = {
      updateByDeviceId: () => {},
    };
    subject = new DeviceHandler(deviceProvider);
  });

  context('Sonoff', () => {
    it('should call add in device provider', (done) => {
      sinon.stub(deviceProvider, 'updateByDeviceId')
        .returns(Promise.resolve());

      const event = {
        deviceId: '2d:5f:22:99:73:d5',
        payload: {
          AppName: 'Sonoff Pow',
          Version: '1.2.3',
          FallbackTopic: 'sonoffback',
          GroupTopic: 'sogroup',
          DeviceId: '2d:5f:22:99:73:d5',
          Topic: 'cmnd/sonoff',
        },
      };

      subject.process(event)
        .then(() => {
          deviceProvider.updateByDeviceId
            .calledOnce.should.be.true;
          deviceProvider.updateByDeviceId
            .calledWith('2d:5f:22:99:73:d5', {
              AppName: 'Sonoff Pow',
              Version: '1.2.3',
              FallbackTopic: 'sonoffback',
              GroupTopic: 'sogroup',
              DeviceId: '2d:5f:22:99:73:d5',
              Topic: 'cmnd/sonoff',
            });
          done();
        })
        .catch(err => done(err));
    });
  });

  context('S6 fresnell', () => {
    it('should call add in device provider', (done) => {
      sinon.stub(deviceProvider, 'updateByDeviceId')
        .returns(Promise.resolve());

      const event =
        {
          deviceId: '00:11:22:33:44:55',
          payload: {
            topic: 'building/room1/sensors/00:11:22:33:44:55/info',
            appName: 'S6 Fresnel Module',
            version: '0.0.1',
            location: 'room1',
          },
        };

      subject.process(event)
        .then(() => {
          deviceProvider.updateByDeviceId
            .calledOnce.should.be.true;
          deviceProvider.updateByDeviceId
            .calledWith('2d:5f:22:99:73:d5', {
              topic: 'building/room1/sensors/00:11:22:33:44:55/info',
              appName: 'S6 Fresnel Module',
              version: '0.0.1',
              location: 'room1',
            });
          done();
        })
        .catch(err => done(err));
    });
  });
});
