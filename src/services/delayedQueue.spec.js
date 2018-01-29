import chai from 'chai';
import sinon from 'sinon';
import DelayedQueue from './delayedQueue';

chai.should();
const expect = chai.expect;

describe('DelayedQueue', () => {
  let subject;
  let clock;

  beforeEach(() => {
    subject = new DelayedQueue(500);
  });

  context('item add/remove handling', () => {

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

  });

  context('expiration handling', () => {
    before(() => {
      clock = sinon.useFakeTimers();
    });

    after(() => {
      clock.restore();
    });

    it('should delete item when timeout expire', () => {
      subject.add({ name: 'an item' });
      subject.isEmpty().should.be.false;
      clock.tick(1000);
      subject.isEmpty().should.be.true;
    });

    it('should emit message when an item expire', () => {
      const callback = sinon.stub();

      subject.setCallback(callback);

      subject.add({ name: 'test expiring item' });
      clock.tick(1000);

      callback.calledOnce
        .should.be.true;
      subject.isEmpty().should.be.true;
    });

    it('should pass expired item data in callback', (done) => {
      const callback = (item) => {
        item.name.should.be.eq('an expiring item');
      };

      const cbSpy = sinon.spy(callback);

      subject.setCallback(cbSpy);

      subject.add({ name: 'an expiring item' });

      clock.tick(1000);
      subject.add({ name: 'NOT an expiring item' });

      subject.remove(item => item.name === 'NOT an expiring item');

      cbSpy.calledOnce.should.be.true;
      subject.isEmpty().should.be.true;
      done();
    });

    it('should remove an expired item', (done) => {
      const callback = (item) => {
        item.name.should.be.eq('an expiring item');
      };

      const cbSpy = sinon.spy(callback);

      subject.setCallback(cbSpy);

      subject.add({ name: 'an expiring item' });

      clock.tick(1000);

      cbSpy.calledOnce.should.be.true;
      subject.isEmpty().should.be.true;

      done();
    });

  });

});
