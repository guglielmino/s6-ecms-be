import chai from 'chai';
import sinon from 'sinon';

import UpdateOnlineStatusHandler from './updateOnlineStatusHandler';
import { DevicesProvider } from '../../../../../data/mongodb/index';

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
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    subject = new UpdateOnlineStatusHandler(deviceProvider);
  });

  context('when a Energy message is received', () => {
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
        Type: 'ENERGY',
        Payload: {
          DeviceId: '12:22:44:1a:d6:fa',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: new Date(),
          created: new Date(),
        },
      };
      subject.process(event)
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
});
