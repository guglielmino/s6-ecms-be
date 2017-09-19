import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import HourlyStatHandler from '../../events/handlers/device/common/powerconsumption/hourlyStatHandler';

import PowerConsumptionRules from './powerConsumption';

chai.should();
const expect = chai.expect();

describe('Power Consumption rules', () => {
  let ruleEngine;
  let hourlyStatHandler;

  beforeEach(() => {
    hourlyStatHandler = HourlyStatHandler();

    sinon.stub(hourlyStatHandler);

    ruleEngine = new EventsRuleEngine();
    PowerConsumptionRules(ruleEngine, {
      hourlyStatHandler,
    });
  });

  context('S6 Fresnel device', () =>{
    it('Should call handle for S6 Power Consume event with right values', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            topic: 'building/room1/sensors/00:11:22:33:44:55/power',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            power: 23.2,
          },
        };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          timestamp: '2017-08-27T07:56:23.642Z',
          gateway: 'CASAFG',
          deviceId: '00:11:22:33:44:55',
          power: 23.2 });
    });
  });

  context('Sonoff device', () => {
    it('Should call handle for Sonoff Power Consume event with right values', () => {

      const event = {
        GatewayId: 'test',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:11:11:22:22:33',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: '2017-08-27T07:56:23.642Z',
          created: new Date(),
        },
      };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          timestamp: '2017-08-27T07:56:23.642Z',
          gateway: 'test',
          deviceId: '11:11:11:22:22:33',
          power: 123 });
    });

  });
});
