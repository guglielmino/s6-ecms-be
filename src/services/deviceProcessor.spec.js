import chai from 'chai';
import sinon from 'sinon';
import DeviceProcessor from './deviceProcessor';

chai.should();
const expect = chai.expect;

describe('DeviceProcessor', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    deviceProvider = {};
    subject = new DeviceProcessor({ deviceProvider });
  });

  it('should call add in device provider', () => {
    deviceProvider.add = sinon.stub();
    const event = {
      Type: 'ENERGY',
      Payload: {
        something: 'here',
      },
    };

    subject.process(event);
    deviceProvider.add
      .calledOnce.should.be.true;
  });
});
