import chai from 'chai';
import sinon from 'sinon';
import DailyStatHandler from './dailyStatHandler';
import DailyStatsProvider from '../../../../../data/mongodb/stats/dailyStatsProvider';

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
    const db = {
      collection: () => {

      },
    };
    dailyStatsProvider = DailyStatsProvider(db);
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

    subject = new DailyStatHandler(dailyStatsProvider);
    subject.process(event)
      .then(() => {
        statsStub.calledOnce.should.be.true;
        statsStub.calledWith({ date, gateway: 'test', deviceId: '00:11:22:33:44:55', today: 0.013 })
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
