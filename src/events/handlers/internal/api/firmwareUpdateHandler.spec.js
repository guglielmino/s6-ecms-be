import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../../../consts';
import FirmwareUpdateHandler from './firmwareUpdateHandler';
import { DevicesProvider } from '../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;

describe('FirmwareUpdateHandler', () => {
  let deviceProvider;
  let subject;
  const pnub = {
    publish: () => {
    },
  };

  beforeEach(() => {
    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    subject = new FirmwareUpdateHandler(deviceProvider, pnub);
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
      type: consts.APPEVENT_TYPE_FIRMWARE,
      payload: {
        topic: 'cmnd/sonoff/FIRMWARE',
        param: {},
      },
    };
    subject.process(event)
      .then(() => {
        publishStub.called.should.be.true;
        publishStub.calledWith('TESTGW', sinon.match({ payload: { topic: 'cmnd/lamp3/Upgrade' } })).should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
