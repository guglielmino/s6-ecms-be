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
  });

  it('should call the function matching the predicate', () => {
    subject.addHandler(msg => msg.Type === consts.EVENT_TYPE_ENERGY, fnEnergy);
    subject.addHandler(msg => msg.Type === consts.EVENT_TYPE_INFO, fnInfo);

    subject.process({ Type: consts.EVENT_TYPE_ENERGY, Payload: "test energy payload" });
    fnEnergy.calledOnce.should.be.true;
    fnInfo.called.should.be.false;
  });

  it('should do nothing when no predicate matches', () => {
    subject.addHandler(msg => msg.Type === consts.EVENT_TYPE_ENERGY, fnEnergy);
    subject.addHandler(msg => msg.Type === consts.EVENT_TYPE_INFO, fnInfo);

    subject.process({ Name: "fake object" });
    fnEnergy.called.should.be.false;
    fnInfo.called.should.be.false;
  });
});
