import chai from 'chai';
import sinon from 'sinon';
import DelayedQueue from './delayedQueue';

chai.should();
const expect = chai.expect;

describe('DelayedQueue', () => {
  let subject;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    subject =  new DelayedQueue();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should add an item with default expiration', () => {
    subject.add({ name: 'an item' });
    subject.isEmpty().should.be.false;
  });

  it('should remove the single item in the list', () => {
    subject.add({ name: 'an item' });
    subject.remove(item => item.name === 'an item');
    subject.isEmpty().should.be.true;
  });


  it('should remove one item from the list', () => {
    subject.add({ name: 'an item' });
    subject.add({ name: 'another item' });
    subject.remove(item => item.name === 'another item');
    subject.isEmpty().should.be.false;
  });

  it('should delete item when timeout expire', () => {
    subject.add({ name: 'an item' }, 500);
    subject.isEmpty().should.be.false;
    clock.tick(1000);
    subject.isEmpty().should.be.true;
  });

  it('should emit message when an item expire', () => {
    const callback = sinon.stub();

    subject.setCallback(callback);

    subject.add({ name: 'an expiring item' }, 500);
    clock.tick(1000);

    callback.calledOnce
      .should.be.true;
    subject.isEmpty().should.be.true;

  });

});
