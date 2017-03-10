

import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../consts';
import messageMediator from './messageMediator';

chai.should();
const expect = chai.expect;

describe('message mediator', () => {
  let subject;
  let fnEnergy,
    fnInfo;

  beforeEach(() => {
    fnEnergy = sinon.stub();
    fnInfo = sinon.stub();
    subject = messageMediator();
    subject.addHandler(consts.EVENT_TYPE_ENERGY, fnEnergy);
    subject.addHandler(consts.EVENT_TYPE_INFO, fnInfo);
  });

  it('should process EVENT_TYPE_ENERGY message', () => {
    const fn = subject.process({ Type: consts.EVENT_TYPE_ENERGY });
    fnEnergy.calledOnce.should.be.true;
    fnInfo.called.should.be.false;
  });

  it('should process EVENT_TYPE_INFO message', () => {
    subject.process({ Type: consts.EVENT_TYPE_INFO });
    fnInfo.calledOnce.should.be.true;
    fnEnergy.called.should.be.false;
  });

  it('should do nothing for an unknown message type', () => {
    subject.process({ Type: 'FAKE_EVENT' });
    fnEnergy.called.should.be.false;
    fnInfo.called.should.be.false;
  });
});
