import chai from 'chai';
import sinon from 'sinon';

import HourlyStatHandler  from './hourlyStatHandler';

import helper from '../../../processor_tests_helper.spec';
helper('./hourlyStatProcessor');

import { HourlyStatsProvider } from '../../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;


describe('HourlyStatHandler', () => {
  let hourlyStatsProvider;
  let subject;

  beforeEach(() => {

    const db = {
      collection: () => {
      },
    };

    hourlyStatsProvider = HourlyStatsProvider(db);
    subject = new HourlyStatHandler(hourlyStatsProvider);
  });

  it('should call updateHourlyStat passing right payload data', (done) => {
    const event = {
      GatewayId: 'TESTGW',
      Type: 'ENERGY',
      Payload: {
        DeviceId: '00:11:22:33:44:55',
        Yesterday: 0.031,
        Today: 0.013,
        Period: 0,
        Power: 123,
        Factor: 0,
        Voltage: 0,
        Current: 0,
        Time: new Date(),
        created: new Date(),
      },
    };

    const statsStub = sinon.stub(hourlyStatsProvider, 'updateHourlyStat')
      .returns(Promise.resolve());

    subject.process(event)
      .then(() => {
        statsStub
          .calledWith(sinon.match({ power: 123, gateway: 'TESTGW', deviceId: '00:11:22:33:44:55' }))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
   });

});
