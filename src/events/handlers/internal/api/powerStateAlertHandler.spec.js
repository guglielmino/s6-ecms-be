import chai from 'chai';
import sinon from 'sinon';
import PowerStateAlertHandler from './powerStateAlertHandler';
import sharedDelayedQueue from '../../../../bootstrap/sharedDelayedQueue';


chai.should();
const expect = chai.expect;

describe('Power State Alert Handler', () => {
  let subject;

  beforeEach(() => {
    sinon.stub(sharedDelayedQueue);

    subject = new PowerStateAlertHandler();
  });

  it('should call \'add\' in sharedQueue with right parameters', () => {
    const event = {
      gateway: 'A GATEWAY',
      deviceId: '00:11:22:33:44:55',
      param: 'sample param',
    };

    subject.process(event);
    sharedDelayedQueue.add.called.should.be.true;
    sharedDelayedQueue.add.calledWith(sinon.match({
      type: 'AE_POWER_ALERT',
      gateway: 'A GATEWAY',
      deviceId: '00:11:22:33:44:55',
      requestStatus: 'sample param',
    })).should.be.true;
  });
});
