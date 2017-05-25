import chai from 'chai';
import sinon from 'sinon';
import SonoffPowTopicHanlders from './sonoffPowTopicHandler';

chai.should();
const expect = chai.expect;

describe('SonoffPowTopicHanlders', () => {
  let subject;

  beforeEach(() => {
    subject = SonoffPowTopicHanlders();

  });

  context('extractNameFromCommandTopic', () => {

    it('should get "lamp1" as result', () => {
      const result = subject.extractNameFromCommandTopic('cmnd/lamp1');
      result.should.be.eq('lamp1');
    });

    it('should get "" as result for not standard Sonoff Pow topics', () => {
      let result = subject.extractNameFromCommandTopic('cmnd/lamp1/POWER');
      result.should.be.empty;

      result = subject.extractNameFromCommandTopic('stat/lamp1');
      result.should.be.empty;
    });

    it('should return default for non standard topic when specified', () => {
      const result = subject.extractNameFromCommandTopic('same_wrong_topic', 'NONAME');
      result.should.be.eq('NONAME');
    });

  });

  context('makePowerCommandFromTopicName', () => {
    it('should get formatted command string from topic', () => {
      const result = subject.makePowerCommandFromTopicName('lamp1');
      result.should.be.eq('mqtt:cmnd/lamp1/POWER');
    });

    it('should return empty string for invalid topic name', () => {
      const result = subject.makePowerCommandFromTopicName('cmnd/lamp1');
      result.should.be.empty;
    });

  });


  context('makePowerCommandFromCmndTopic', () => {
    it('should get formatted command string from command topic', () => {
      const result = subject.makePowerCommandFromCmndTopic('cmnd/lamp1');
      result.should.be.eq('mqtt:cmnd/lamp1/POWER');
    });

    it('should return empy string for invalid topic name', () => {
      const result = subject.makePowerCommandFromCmndTopic('lamp1');
      result.should.be.empty;
    });
  });

  context('extractNameFromStatTopic', () => {
    it('should get "lamp1" as result', () => {
      const result = subject.extractNameFromTopic('stat', 'stat/lamp1/RESULT');
      result.should.be.eq('lamp1');
    });

    it('should get empty string if passed topic isn\'t in right format', () => {
      const result = subject.extractNameFromTopic('stat', 'cmnd/lamp1/POWER');
      result.should.be.empty;
    });

    it('should return default if passed topic isn\'t in right format', () => {
      const result = subject.extractNameFromCommandTopic('same_wrong_topic', 'DEFAULT_STRING');
      result.should.be.eq('DEFAULT_STRING');
    });
  });
});
