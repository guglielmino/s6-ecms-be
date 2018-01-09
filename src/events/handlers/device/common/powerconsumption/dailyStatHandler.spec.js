import chai from 'chai';
import sinon from 'sinon';
import DailyStatHandler from './dailyStatHandler';

import logger from '../../../../../common/logger';

chai.should();
const expect = chai.expect();

describe('DailyStatHandler', () => {
  let subject;
  let dailyStatsProvider;
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger, 'log');
  });

  after(() => {
    loggerStub.restore();
  });

  beforeEach(() => {

    dailyStatsProvider = {
      updateDailyStat: () => {},
      getDailyStatsForDeviceId: () => {},
    };
  });

  it('should sum current and daily consumption if current is less than daily', (done) => {
    const date = new Date();

    const event = {
      timestamp: date,
      gateway: 'test',
      deviceId: '00:11:22:33:44:55',
      dailyconsume: 0.1,
    };

    const statsStub = sinon.stub(dailyStatsProvider, 'updateDailyStat')
      .returns(Promise.resolve());

    const getStatsStub = sinon.stub(dailyStatsProvider, 'getDailyStatsForDeviceId')
      .returns(Promise.resolve({ today: 0.5 }));

    subject = new DailyStatHandler(dailyStatsProvider);
    subject.process(event)
      .then(() => {
        getStatsStub.calledOnce.should.be.true;
        getStatsStub.calledWith(date, '00:11:22:33:44:55').should.be.true;
        statsStub.calledOnce.should.be.true;
        statsStub.calledWith({ date, gateway: 'test', deviceId: '00:11:22:33:44:55', today: 0.6 })
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should update status with current consumption if current is greather than daily', (done) => {
    const date = new Date();

    const event = {
      timestamp: date,
      gateway: 'test',
      deviceId: '00:11:22:33:44:55',
      dailyconsume: 0.5,
    };

    const statsStub = sinon.stub(dailyStatsProvider, 'updateDailyStat')
      .returns(Promise.resolve());

    const getStatsStub = sinon.stub(dailyStatsProvider, 'getDailyStatsForDeviceId')
      .returns(Promise.resolve({ today: 0.1 }));

    subject = new DailyStatHandler(dailyStatsProvider);
    subject.process(event)
      .then(() => {
        getStatsStub.calledOnce.should.be.true;
        getStatsStub.calledWith(date, '00:11:22:33:44:55').should.be.true;
        statsStub.calledOnce.should.be.true;
        statsStub.calledWith({ date, gateway: 'test', deviceId: '00:11:22:33:44:55', today: 0.5 })
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should update stats', (done) => {
    const date = new Date();

    const event = {
      timestamp: date,
      gateway: 'test',
      deviceId: '00:11:22:33:44:55',
      dailyconsume: 0.013,
    };

    const statsStub = sinon.stub(dailyStatsProvider, 'updateDailyStat')
      .returns(Promise.resolve());

    const getStatsStub = sinon.stub(dailyStatsProvider, 'getDailyStatsForDeviceId')
      .returns(Promise.resolve());

    subject = new DailyStatHandler(dailyStatsProvider);
    subject.process(event)
      .then(() => {
        getStatsStub.calledOnce.should.be.true;
        getStatsStub.calledWith(date, '00:11:22:33:44:55').should.be.true;
        statsStub.calledOnce.should.be.true;
        statsStub.calledWith({ date, gateway: 'test', deviceId: '00:11:22:33:44:55', today: 0.013 })
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
