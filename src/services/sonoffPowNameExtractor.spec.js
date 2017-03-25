import chai from 'chai';
import sinon from 'sinon';
import SonoffPowNameExtractor from './sonoffPowNameExtractor';

chai.should();
const expect = chai.expect;

describe('event processor mediator', () => {
  let subject;

  it('should get "lamp1" as result', () => {
    const result  = SonoffPowNameExtractor('cmnd/lamp1');
    result.should.be.eq('lamp1');
  });

  it('should get "" as result for not standard Sonoff Pow topics', () => {
    let result = SonoffPowNameExtractor('cmnd/lamp1/POWER');
    result.should.be.empty;

    result = SonoffPowNameExtractor('stat/lamp1');
    result.should.be.empty;
  });

  it('should return default for non standard topic when specified', () => {
    const result = SonoffPowNameExtractor('same_wrong_topic', 'NONAME');
    result.should.be.eq('NONAME');
  })
});
