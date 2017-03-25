import chai from 'chai';
import sinon from 'sinon';
import PowerFeedbackProcessor from './powerFeedbackProcessor';

chai.should();
const expect = chai.expect;

describe('PowerFeedbackProcessor', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    deviceProvider = {};
    subject = new PowerFeedbackProcessor({ deviceProvider });
  });

  it('should call findByPowerCommand with topicName', () => {
    deviceProvider.findByPowerCommand = sinon.stub().returns(Promise.resolve({}));
    deviceProvider.update = sinon.stub();

    const event = {
      GatewayId: 'TESTGW',
      Type: 'POWER_STATUS',
      Payload: {
        Topic: 'stat/lamp3/RESULT',
        Power: 'off',
        TopicName: 'lamp3',
      }
    };

    subject.process(event);
    deviceProvider.findByPowerCommand
      .calledWith('lamp3')
      .should.be.true;
  });
});
