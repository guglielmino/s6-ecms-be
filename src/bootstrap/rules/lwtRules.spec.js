import sinon from 'sinon';
import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import LwtHandler from '../../events/handlers/device/sonoff/lwt/lwtHandler';
import LwtRules from './lwtRules';

chai.should();

describe('Sonoff LWT Rules', () => {
  let ruleEngine;
  let lwtHandler;

  beforeEach(() => {
    lwtHandler = LwtHandler();

    sinon.stub(lwtHandler);

    ruleEngine = new EventsRuleEngine();
    LwtRules(ruleEngine, {
      lwtHandler,
    });
  });

  it('Should call \'process\' of every handler for a LWT message', () => {
    const event = {
      GatewayId: 'TESTGW',
      Type: 'LWT',
      Payload: {
        Topic: 'tele/lamp3/LWT',
        Status: 'Online',
        DeviceId: '12:22:44:1a:d6:fa',
      },
    };

    ruleEngine.handle(event);

    lwtHandler.process
      .calledOnce.should.be.true;
  });

  it('Should NOT call \'process\' of every handler for generic message', () => {
    const event = {
      GatewayId: 'test',
      Type: 'ENERGY',
      Payload: {
        DeviceId: 'tele/lamp_test/TELEMETRY',
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

    ruleEngine.handle(event);

    lwtHandler.process
      .calledOnce.should.be.false;
  });
});
