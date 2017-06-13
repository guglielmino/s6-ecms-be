import chai from 'chai';
import sinon from 'sinon';


import EventsChainProcessor from './eventChainProcessor';
import logger from '../common/logger';

chai.should();
const expect = chai.expect;

describe('event processor mediator', () => {
  let subject;
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger);
  });

  beforeEach(() => {
    subject = new EventsChainProcessor();
  });

  it('should add an item in the chain', () => {
    subject.add({
      predicate: msg => true,
      fn: msg => msg,
    });
  });

  it('should throw if added item isn\'t made of predicate and fn', () => {
    subject.add({
      prop1: 'sample',
      prop2: 'test',
    });
    subject.add.should.throw();
  });

  it('should exec fn where predicate is true', () => {
    const fnexec = sinon.spy();
    const fnnoexec = sinon.spy();

    subject.add({
      predicate: msg => true,
      fn: msg => fnexec(msg),
    });
    subject.add({
      predicate: msg => false,
      fn: msg => fnnoexec(msg),
    });

    subject.handle({ type: 'sample', name: 'a sample message' });

    fnexec.called.should.be.true;
    fnnoexec.called.should.not.be.true;
  });

  it('should exec all item where predicate returns true', () => {
    const fnexec1 = sinon.spy();
    const fnexec2 = sinon.spy();

    subject.add({
      predicate: msg => true,
      fn: msg => fnexec1(msg),
    });
    subject.add({
      predicate: msg => true,
      fn: msg => fnexec2(msg),
    });

    subject.handle({ type: 'sample', name: 'a sample message' });

    fnexec1.called.should.be.true;
    fnexec2.called.should.be.true;
  });

  it('should log unprocessed event one time only', () => {
    subject.add({
      predicate: msg => msg.type === 'type1',
      fn: msg => msg,
    });

    subject.add({
      predicate: msg => msg.type === 'type2',
      fn: msg => msg,
    });

    subject.handle({ type: 'type3' });
    logger.log.calledOnce.should.be.true;
    logger.log.calledWith('error', 'Unknown {"type":"type3"}')
      .should.be.true;
  });
});
