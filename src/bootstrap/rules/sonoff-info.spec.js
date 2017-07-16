import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DeviceHandler from '../../events/handlers/device/info/deviceHandler';

import InfoRules from './sonoff-info';

chai.should();
const expect = chai.expect();

describe('Sonoff Info Rules', () => {
  let ruleEngine;
  let deviceHandler;

  beforeEach(() => {
    deviceHandler = DeviceHandler();

    sinon.stub(deviceHandler);

    ruleEngine = new EventsRuleEngine();
    InfoRules(ruleEngine, {
      deviceHandler,
    });
  });

  it('Should call \'process\' of every handler for a Info message', () => {
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

    deviceHandler.process
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

    deviceHandler.process
      .calledOnce.should.be.false;

  });
});
