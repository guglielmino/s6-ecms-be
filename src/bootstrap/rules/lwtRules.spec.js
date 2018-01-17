import sinon from 'sinon';
import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import LwtHandler from '../../events/handlers/device/common/lwt/lwtHandler';
import LwtStatusAlertHandler from '../../events/handlers/device/common/alerts/lwtStatusAlertHandler';
import LwtOnlineAlertHandler from '../../events/handlers/device/common/alerts/lwtOnlineAlertHandler';
import LwtRules from './lwtRules';

chai.should();

describe('LWT Rules', () => {
  let ruleEngine;
  let lwtHandler;
  let lwtStatusAlertHandler;
  let lwtOnlineAlertHandler;
  let socket;

  beforeEach(() => {
    lwtHandler = LwtHandler();
    lwtStatusAlertHandler = LwtStatusAlertHandler();
    lwtOnlineAlertHandler = LwtOnlineAlertHandler();

    sinon.stub(lwtHandler);
    sinon.stub(lwtStatusAlertHandler);
    sinon.stub(lwtOnlineAlertHandler);
    socket = {};
    socket.emit = sinon.spy();

    ruleEngine = new EventsRuleEngine();
    LwtRules(ruleEngine, {
      lwtHandler,
      lwtOnlineAlertHandler,
      lwtStatusAlertHandler,
    });
  });

  context('Sonoff', () => {
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

  });

  context('S6 Fresnel device', () => {
    it('Should call \'process\' of every handler for a LWT message by S6 fresnel devices', () => {
      const event = {
        GatewayId: 'TESTGW',
        Type: 'FRESNEL_LWT',
        Payload: {
          Topic: 'tele/lamp3/LWT',
          status: 'Online',
          deviceId: '12:22:44:1a:d6:fa',
        },
      };

      ruleEngine.handle(event);

      lwtHandler.process
        .calledOnce.should.be.true;
    });
  });

  context('Lwt alerts', () => {
    it('should call process of lwt alert handler if device status is OFFLINE', () => {
      const message = {
        type: 'AE_LWT_ALERT',
        status: 'Offline',
        device: {
          deviceId: '13:32:22:34:55:12',
          name: 'test',
          description: 'device desc',
        },
      };

      ruleEngine.handle(message);

      lwtStatusAlertHandler.process
        .calledOnce.should.be.true;

      lwtOnlineAlertHandler.process.called.should.be.false;
    });

    it('should call process of lwt online handler if device status is ONLINE', () => {
      const message = {
        type: 'AE_LWT_ALERT',
        status: 'Online',
        device: {
          deviceId: '13:32:22:34:55:12',
          name: 'test',
          description: 'device desc',
        },
      };

      ruleEngine.handle(message);

      lwtStatusAlertHandler.process.called.should.be.false;
      lwtOnlineAlertHandler.process
        .called.should.be.true;
    });
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
