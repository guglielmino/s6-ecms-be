import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import S6HourlyStatHandler from '../../events/handlers/device/s6fresnel/hourlyStatHandler';

import S6PowerConsumeRules from './s6fresnel-power-consume';

chai.should();
const expect = chai.expect();

describe('S6 Fresnel Power Consume Rules', () => {
  let ruleEngine;
  let hourlyStatHandler;

  beforeEach(() => {
    hourlyStatHandler = S6HourlyStatHandler();

    sinon.stub(hourlyStatHandler);

    ruleEngine = new EventsRuleEngine();
    S6PowerConsumeRules(ruleEngine, {
      hourlyStatHandler,
    });
  });

  it('Should call \'process\' of every handler for a Power Consume message', () => {
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
  });

  it('Should NOT call \'process\' for wrong INFO message', () => {
    const event = {
      GatewayId: 'testGateway',
      Type: 'INFO',
      Payload: {
        AppName: 'Sonoff Pow Module',
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'sogroup',
        DeviceId: '2d:5f:22:99:73:d5',
        Topic: 'cmnd/sonoff',
      },
    };
    ruleEngine.handle(event);

    hourlyStatHandler.process
      .calledOnce.should.be.false;

  });
});
