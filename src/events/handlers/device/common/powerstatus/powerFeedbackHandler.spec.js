import chai from 'chai';
import sinon from 'sinon';

import helper from '../../../processor_tests_helper.spec';

helper('./powerFeedbackProcessor');
import { DevicesProvider } from '../../../../../data/mongodb/index';

import PowerFeedbackHandler from './powerFeedbackHandler';

chai.should();
const expect = chai.expect;

describe('PowerFeedbackHandler', () => {
  let subject;
  let deviceProvider;
  let socket;

  beforeEach(() => {
    const db = {
      collection: () => {
      },
    };
    deviceProvider = DevicesProvider(db);
    socket = {};
    subject = new PowerFeedbackHandler(deviceProvider, socket);
  });

  it('should update SONOFF device power status based on received Payload', (done) => {
    sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(Promise.resolve({
      gateway: 'TESTGW',
      swVersion: '1.2.3',
      deviceType: 'Sonoff Pow Module',
      deviceId: '11:44:41:9f:66:ea',
      name: 'UpsertDevice',
      commands: {
        power: 'mqtt:cmnd/test6/POWER',
      },
      status: {
        power: 'on',
        online: false,
      },
      created: new Date(),
    })));

    sinon.stub(deviceProvider, 'update');
    socket.emit = sinon.stub();

    const event = {
      powerStatus: 'off',
      deviceId: '00:11:22:33:44:55',
    };

    subject.process(event)
      .then(() => {
        deviceProvider
          .findByDeviceId
          .calledWith('00:11:22:33:44:55')
          .should.be.true;

        deviceProvider
          .update.calledWith(sinon.match.any, sinon.match({status: {power: 'off', online: false}}))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should update S6 FRESNEL device power status based on received Payload', (done) => {
    sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve(Promise.resolve({
        gateway: 'CASAFG',
        swVersion: '1.2.3',
        deviceType: 'S6 Fresnel Module',
        deviceId: '00:11:22:33:44:55',
        name: 'UpsertDevice',
        commands: {
          power: 'mqtt:building/room1/events/00:11:22:33:44:55/power',
        },
        status: {
          power: 'on',
          online: false,
        },
        created: new Date(),
      })));

    sinon.stub(deviceProvider, 'update');
    socket.emit = sinon.stub();

    const event = {
      deviceId: '00:11:22:33:44:55',
      powerStatus: 'off',
    };

    subject.process(event)
      .then(() => {
        deviceProvider
          .findByDeviceId
          .calledWith('00:11:22:33:44:55')
          .should.be.true;

        deviceProvider
          .update.calledWith(sinon.match.any, sinon.match({status: {power: 'off', online: false}}))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
