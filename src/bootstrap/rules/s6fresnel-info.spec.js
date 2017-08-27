import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DeviceHandler from '../../events/handlers/device/common/info/deviceHandler';

import InfoRules from './s6fresnel-info';

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
        Type: 'FRESNEL_INFO',
        Payload: {
          topic: 'building/room1/sensors/00:11:22:33:44:55/info',
          deviceId: '00:11:22:33:44:55',
          appName: 'S6 Fresnel Module',
          version: '0.0.1',
          location: 'room1',

        },
      };

    ruleEngine.handle(event);

    deviceHandler.process
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

    deviceHandler.process
      .calledOnce.should.be.false;

  });
});
