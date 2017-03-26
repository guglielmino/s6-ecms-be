import chai from 'chai';
import sinon from 'sinon';
import PowerFeedbackProcessor from './powerFeedbackProcessor';

chai.should();
const expect = chai.expect;

describe('PowerFeedbackProcessor', () => {
  let subject;
  let deviceProvider;
  let socket;

  beforeEach(() => {
    deviceProvider = {};
    socket = {};
    subject = new PowerFeedbackProcessor({ deviceProvider }, socket);
  });

  it('should call findByCommand with topicName', () => {
    deviceProvider.findByCommand = sinon.stub().returns(Promise.resolve({}));
    deviceProvider.update = sinon.stub();
    socket.emit = sinon.stub();

    const event = {
      GatewayId: 'TESTGW',
      Type: 'POWER_STATUS',
      Payload: {
        Topic: 'stat/lamp3/RESULT',
        Power: 'off',
        PowerCommand: 'mqtt:cmnd/lamp3/POWER',
      }
    };

    subject.process(event);
    deviceProvider
      .findByCommand
      .calledWith('power', event.Payload.PowerCommand)
      .should.be.true;
  });

});
