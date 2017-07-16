import sinon from 'sinon';
import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import PowerFeedbackHandler from '../../events/handlers/device/powerstatus/powerFeedbackHandler';

import PowerRules from './sonoff-power';

chai.should();
const expect = chai.expect();

describe('Sonoff Power Rules', () => {
  let ruleEngine;
  let powerFeedbackHandler;

  beforeEach(() => {
    powerFeedbackHandler = PowerFeedbackHandler();

    sinon.stub(powerFeedbackHandler);

    ruleEngine = new EventsRuleEngine();
    PowerRules(ruleEngine, {
      powerFeedbackHandler,
    });
  });

  it('Should call \'process\' of every handler for a Info message', () => {
    const event = {
      GatewayId: 'TESTGW',
      Type: 'POWER_STATUS',
      Payload: {
        Topic: 'stat/lamp3/RESULT',
        Power: 'off',
        PowerCommand: 'mqtt:cmnd/lamp3/POWER',
        DeviceId: '00:11:22:33:44:55',
      },
    };

    ruleEngine.handle(event);

    powerFeedbackHandler.process
      .calledOnce.should.be.true;
  });

  it('Should NOT call \'process\' of every handler for generic message', () => {
    const event =
      {
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

    powerFeedbackHandler.process
      .calledOnce.should.be.false;

  });

});
