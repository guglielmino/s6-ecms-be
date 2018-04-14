import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DailyStatHandler from '../../events/handlers/device/common/powerconsumption/dailyStatHandler';
import DailyConsumptionRules from './dailyConsumptionRules';

chai.should();
const expect = chai.expect();

describe('Daily Consumption Rules', () => {
  let ruleEngine;
  let dailyStatHandler;

  beforeEach(() => {
    dailyStatHandler = DailyStatHandler();

    sinon.stub(dailyStatHandler);

    ruleEngine = new EventsRuleEngine();
    DailyConsumptionRules(ruleEngine, {
      dailyStatHandler,
    });
  });

  context('S6 Fresnel device daily consumption', () => {
    it('call dailyStatHandler\'s process passing right values', () => {
      const msg = {
        Type: 'FRESNEL_DAILY_CONSUME',
        GatewayId: 'TESTGW',
        Payload: {
          value: 200,
          unit: 'Kwh',
          timestamp: '2017-11-30T07:56:23.642Z',
        },
      };
      ruleEngine.handle(msg);

      dailyStatHandler.process
        .calledOnce.should.be.true;

      dailyStatHandler.process
        .calledWith({
          timestamp: '2017-11-30T07:56:23.642Z',
          gateway: 'TESTGW',
          deviceId: undefined,
          dailyconsume: 200,
        }).should.be.true;
    });
  });

  context('S6 Fresnel device daily consumption with Type from Topic', () => {
    it('call dailyStatHandler\'s process passing right values', () => {
      const msg = {
        Type: 'sensors_dailyKwh',
        GatewayId: 'TESTGW',
        Payload: {
          value: 200,
          unit: 'Kwh',
          timestamp: '2017-11-30T07:56:23.642Z',
        },
      };
      ruleEngine.handle(msg);

      dailyStatHandler.process
        .calledOnce.should.be.true;

      dailyStatHandler.process
        .calledWith({
          timestamp: '2017-11-30T07:56:23.642Z',
          gateway: 'TESTGW',
          deviceId: undefined,
          dailyconsume: 200,
        }).should.be.true;
    });
  });
});
