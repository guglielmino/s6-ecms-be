import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../../../consts';
import PowerStateHandler from './powerStateHandler';

import helper from '../../processor_tests_helper.spec';
helper('./powerStateProcessor');
import payloadFactory from '../../factory/payloadFactory';

import { DevicesProvider } from '../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;

describe('Power Handler', () => {
  let subject;
  let deviceProvider;
  let pnub;
  let createPowerPayload;
  const fakePayload = {
    topic: 'cmnd/test/POWER',
  };

  beforeEach(() => {
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    pnub = {};
    subject = new PowerStateHandler(deviceProvider, pnub);

    createPowerPayload = sinon.stub(payloadFactory.prototype, 'createPowerSwitchPayload').returns(fakePayload);
  });

  it('should publish enclosed mqtt message on PubNub', (done) => {
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
        gateway: 'agateway',
        deviceId: '11:44:41:9f:66:ea',
        param: 'on',
      };

    subject.process(event)
      .then(() => {
        pnub.publish
          .calledWith(sinon.match.any, sinon.match({ payload: fakePayload }))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  afterEach(() => {
    createPowerPayload.restore();
  });

});
