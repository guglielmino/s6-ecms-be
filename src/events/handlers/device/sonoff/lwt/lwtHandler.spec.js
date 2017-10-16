import chai from 'chai';
import sinon from 'sinon';
import LwtHandler from './lwtHandler';
import { DevicesProvider } from '../../../../../data/mongodb/index';
import logger from '../../../../../common/logger';
import * as consts from '../../../../../../consts';

chai.should();
const expect = chai.expect;

describe('LwtHandler', () => {
  let subject;
  let deviceProvider;
  let emitter;
  let stubbedLog;

  beforeEach(() => {
    const db = {
      collection: () => {
      },
    };
    emitter = {};
    emitter.emit = sinon.spy();
    stubbedLog = sinon.stub(logger, 'log');
    deviceProvider = DevicesProvider(db);
    subject = new LwtHandler(deviceProvider, emitter);
  });

  afterEach(() => {
    stubbedLog.restore();
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
        status: 'Online',
        deviceId: '12:22:44:1a:d6:fa',
      };

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId.calledWith('12:22:44:1a:d6:fa')
            .should.be.true;
          deviceProvider.updateByDeviceId
            .calledWith('12:22:44:1a:d6:fa',
              sinon.match({ status: { online: true } }))
            .should.be.true;
          //emit event to generate alert
          emitter.emit.calledWith('event', {type: consts.APPEVENT_TYPE_LWT_ALERT, status: 'Online', device }).should.be.true;
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
        status: {
          online: false,
          power: 'off',
        },
        created: new Date(),
      };

      sinon.stub(deviceProvider, 'updateByDeviceId').returns(Promise.resolve());
      sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(device));

      const event = {
        status: 'Offline',
        deviceId: '12:22:44:1a:d6:fa',
      };

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId
            .calledWith('12:22:44:1a:d6:fa').should.be.true;
          deviceProvider.updateByDeviceId
            .calledWith('12:22:44:1a:d6:fa',
              sinon.match({ status: { online: false, power: 'off' } }))
            .should.be.true;
          //emit event to generate alert
          emitter.emit.calledWith('event', {type: consts.APPEVENT_TYPE_LWT_ALERT, status: 'Offline', device }).should.be.true;
          done();
        })
        .catch(err => done(err));
    });
  });
});
