import chai from 'chai';
import sinon from 'sinon';
import DeviceHandler from './deviceHandler';
import { DevicesProvider } from '../../../../../data/mongodb/index';

import helper from '../../../processor_tests_helper.spec';
helper('./deviceProcessor');

chai.should();
const expect = chai.expect;

describe('DeviceHandler', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    const db = {
      collection: () => {
      },
    };
    deviceProvider = DevicesProvider(db);
    subject = new DeviceHandler(deviceProvider);
  });

  it('should call add in device provider', (done) => {
    sinon.stub(deviceProvider, 'updateByDeviceId')
      .returns(Promise.resolve({
        gateway: 'agateway',
        swVersion: '1.2.3',
        deviceType: 'Sonoff Pow Module',
        deviceId: '11:44:41:9f:66:ea',
        name: 'UpsertDevice',
        commands: {
          power: 'mqtt:cmnd/test6/POWER',
        },
        created: new Date(),
      }));

    const event =
      {
        GatewayId: 'testGateway',
        Type: 'INFO',
        Payload: {
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
        done();
      })
      .catch(err => done(err));
  });
});
