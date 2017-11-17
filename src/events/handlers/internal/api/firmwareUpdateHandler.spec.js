import chai from 'chai';
import sinon from 'sinon';
import FirmwareUpdateHandler from './firmwareUpdateHandler';
import { DevicesProvider } from '../../../../data/mongodb/index';
import PayloadFactory from '../../factory/payloadFactory';

chai.should();
const expect = chai.expect;

describe('FirmwareUpdate Handler', () => {
  let deviceProvider;
  let subject;
  const pnub = {
    publish: () => {
    },
  };
  const fakePayload = {
    topic: 'cmd/testdev/Upgrade',
    value: 1,
  };
  let createFirmwarePayload;

  beforeEach(() => {
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    subject = new FirmwareUpdateHandler(deviceProvider, pnub);
    createFirmwarePayload = sinon.stub(PayloadFactory.prototype, 'createFirmwareUpdatePayload').returns(fakePayload);
  });

  it('should send MQTT command with right payload', (done) => {
    const dev = {
      gateway: 'gateway',
      swVersion: '1.2.2',
      deviceType: 'Sonoff Pow Module',
      deviceId: '12:22:44:1a:d6:fa',
      name: 'lamp3',
      commands: {
        power: 'mqtt:cmnd/sonoff/POWER'
      },
      status: {},
      created: new Date(),
    };

    const publishStub = sinon.stub(pnub, 'publish');

    sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(dev));

    const event = {
      gateway: 'TESTGW',
      deviceId: '12:22:44:1a:d6:fa',
      command: 'AE_FIRMWARE_UPDATE',
    };
    subject.process(event)
      .then(() => {
        publishStub.called.should.be.true;
        publishStub.calledWith('TESTGW', sinon.match({ payload: fakePayload }))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  afterEach(() => {
    createFirmwarePayload.restore();
  });
});
