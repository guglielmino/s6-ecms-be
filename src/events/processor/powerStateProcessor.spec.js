import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../consts';
import PowerStateProcessor from './powerStateProcessor';

import helper from './processor_tests_helper.spec';
helper('./powerStateProcessor');

import { DevicesProvider } from '../../data/mongodb';

chai.should();
const expect = chai.expect;

describe('LwtProcessor', () => {
  let subject;
  let deviceProvider;
  let pnub;

  beforeEach(() => {
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    pnub = {};
    subject = new PowerStateProcessor({ deviceProvider }, pnub);
  });

  it('should publish elcosed mqtt message on PubNub', (done) => {
    pnub.publish = sinon.stub();
    sinon.stub(deviceProvider, 'findByDeviceId')
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

        done();
      });
  });

});
