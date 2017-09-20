import sinon from 'sinon';
import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import EnergyAlertHandler from '../../events/handlers/device/sonoff/energy/energyAlertHandler';
import UpdateOnlineStatusHandler from '../../events/handlers/device/sonoff/energy/updateOnlineStatusHandler';
import EnergyRules from './sonoff-energy';

chai.should();
const expect = chai.expect();

describe('Sonoff Energy Rules', () => {
  let ruleEngine;
  let energyEventProcessor;
  let updateOnlineStatusHandler;

  beforeEach(() => {

    energyEventProcessor = EnergyAlertHandler();
    updateOnlineStatusHandler = UpdateOnlineStatusHandler();

    sinon.stub(energyEventProcessor);
    sinon.stub(updateOnlineStatusHandler);

    ruleEngine = new EventsRuleEngine();
    EnergyRules(ruleEngine, {
      energyEventProcessor,
      updateOnlineStatusHandler,
    });
  });

  it('Should call \'process\' of every handler for a Energy message', () => {

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

    energyEventProcessor.process
      .calledOnce.should.be.true;

    updateOnlineStatusHandler.process
      .calledOnce.should.be.true;
  });

  it('Should NOT call \'process\' of every handler for generic message', () => {
    const event =
      {
        GatewayId: 'testGateway',
        Type: 'INFO',
        Payload: {
          AppName: 'Sonoff Pow',
          Version: '1.2.3',
          FallbackTopic: 'sonoffback',
          GroupTopic: 'sogroup',
          DeviceId: '2d:5f:22:99:73:d5',
          Topic: 'cmnd/sonoff',
        },
      };

    ruleEngine.handle(event);


    energyEventProcessor.process
      .calledOnce.should.be.false;

    updateOnlineStatusHandler.process
      .calledOnce.should.be.false;
  });

});
