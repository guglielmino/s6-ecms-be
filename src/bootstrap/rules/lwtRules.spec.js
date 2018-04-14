import sinon from 'sinon';
import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import LwtHandler from '../../events/handlers/device/common/lwt/lwtHandler';
import LwtStatusAlertHandler from '../../events/handlers/device/common/alerts/lwtStatusAlertHandler';
import CloseAlertHandler from '../../events/handlers/device/common/alerts/closeAlertHandler';
import LwtRules from './lwtRules';
import { types } from '../../common/alertConsts';

chai.should();

describe('LWT Rules', () => {
  let ruleEngine;
  let lwtHandler;
  let lwtStatusAlertHandler;
  let closeAlertHandler;
  let socket;

  beforeEach(() => {
    lwtHandler = LwtHandler();
    lwtStatusAlertHandler = LwtStatusAlertHandler();
    closeAlertHandler = CloseAlertHandler();

    sinon.stub(lwtHandler);
    sinon.stub(lwtStatusAlertHandler);
    sinon.stub(closeAlertHandler);
    socket = {};
    socket.emit = sinon.spy();

    ruleEngine = new EventsRuleEngine();
    LwtRules(ruleEngine, {
      lwtHandler,
      closeAlertHandler,
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

  context('S6 Fresnel device with Type from Topic', () => {
    it('Should call \'process\' of every handler for a LWT message by S6 fresnel devices', () => {
      const event = {
        GatewayId: 'TESTGW',
        Type: 'events_lwt',
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

      closeAlertHandler.process.called.should.be.false;
    });

    it('should call close last offline alert if device status is online', () => {
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
      closeAlertHandler.process
        .called.should.be.true;

      closeAlertHandler.process.calledWith(sinon.match({ type: types.ALERT_TYPE_DEVICE_STATUS })).should.be.true;
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
