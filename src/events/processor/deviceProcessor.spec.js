import chai from 'chai';
import sinon from 'sinon';
import DeviceProcessor from './deviceProcessor';
import { DevicesProvider } from '../../data/mongodb';

import helper from './processor_tests_helper.spec';
helper('./deviceProcessor');

chai.should();
const expect = chai.expect;

describe('DeviceProcessor', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    const db = {
      collection: () => {
      },
    };
    deviceProvider = DevicesProvider(db);
    subject = new DeviceProcessor({ deviceProvider });
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

    const event = {
      Type: 'ENERGY',
      Payload: {
        something: 'here',
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
