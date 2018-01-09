import chai from 'chai';
import sinon from 'sinon';

import HourlyStatHandler from './hourlyStatHandler';

import helper from '../../../processor_tests_helper.spec';

helper('./hourlyStatProcessor');

chai.should();
const expect = chai.expect;


describe('HourlyStatHandler', () => {
  let hourlyStatsProvider;
  let subject;

  beforeEach(() => {

    hourlyStatsProvider = {
      updateHourlyStat: () => {},
    };
    subject = new HourlyStatHandler(hourlyStatsProvider);
  });

  it('should call updateHourlyStat passing right payload data', (done) => {
    const event = {
      gateway: 'CASAFG',
      deviceId: '00:11:22:33:44:55',
      timestamp: '2017-08-27T07:56:23.642Z',
      power: 9.4,
    };

    const statsStub = sinon.stub(hourlyStatsProvider, 'updateHourlyStat')
      .returns(Promise.resolve());

    subject.process(event)
      .then(() => {
        statsStub
          .calledWith(sinon.match({ power: 9.4, gateway: 'CASAFG', deviceId: '00:11:22:33:44:55' }))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

});
