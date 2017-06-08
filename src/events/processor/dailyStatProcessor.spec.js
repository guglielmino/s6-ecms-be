import chai from 'chai';
import sinon from 'sinon';
import DailyStatProcessor from './dailyStatProcessor';
import DailyStatsProvider from '../../data/mongodb/stats/dailyStatsProvider';

chai.should();
const expect = chai.expect();

describe('Daily stat processor', () => {
  let subject;
  let dailyStatsProvider;

  beforeEach(() => {
    const db = {
      collection: () => {

      },
    };
    dailyStatsProvider = DailyStatsProvider(db);
  });

  it('should update stats', (done) => {
    const event = {
      GatewayId: 'test',
      Payload: {
        Time: '00',
        Today: 1233,
      },
    };

    const statsStub = sinon.stub(dailyStatsProvider, 'updateDailyStat').returns(Promise.resolve());

    subject = new DailyStatProcessor({ dailyStatsProvider });
    subject.process(event)
      .then(() => {
        statsStub.calledOnce.should.be.true;
        statsStub.calledWith({ date: '00', gateway: 'test', today: 1233 }).should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
