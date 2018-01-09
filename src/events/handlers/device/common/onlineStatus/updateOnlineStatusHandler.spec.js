import chai from 'chai';
import sinon from 'sinon';

import UpdateOnlineStatusHandler from './updateOnlineStatusHandler';

import logger from '../../../../../common/logger';

chai.should();
const expect = chai.expect;

describe('UpdateOnlineStatusHandler', () => {
  let subject;
  let deviceProvider;
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger, 'log');
  });

  after(() => {
    loggerStub.restore();
  });

  beforeEach(() => {
    deviceProvider = {
      updateByDeviceId: () => {},
      findByDeviceId: () => {},
    };
    subject = new UpdateOnlineStatusHandler(deviceProvider);
  });

  context('when a SONOFF Energy message is received', () => {
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

      subject.process({ deviceId: '12:22:44:1a:d6:fa' })
        .then(() => {
          deviceProvider.findByDeviceId
            .calledWith('12:22:44:1a:d6:fa')
            .should.be.true;

          deviceProvider.updateByDeviceId
            .calledWith('12:22:44:1a:d6:fa',
              sinon.match({ status: { online: true } }))
            .should.be.true;

          done();
        })
        .catch(err => done(err));
    });
  });

  context('when a S6 Fresnel power consumption message is received',  () => {
    it('should set device status Online = true', (done) => {
      const device = {
        name: 'Lamp1',
        description: 'Lamp1',
        gateway: 'CASAFG',
        swVersion: '0.0.1',
        deviceType: 'S6 Fresnel Module',
        deviceId: '00:11:22:33:44:55',
      };

      sinon.stub(deviceProvider, 'updateByDeviceId').returns(Promise.resolve());
      sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(device));


      subject.process({ deviceId: '00:11:22:33:44:55' })
        .then(() => {
          deviceProvider.findByDeviceId
            .calledWith('00:11:22:33:44:55')
            .should.be.true;

          deviceProvider.updateByDeviceId
            .calledWith('00:11:22:33:44:55',
              sinon.match({ status: { online: true } }))
            .should.be.true;

          done();
        })
        .catch(err => done(err));
    });
  });
});
