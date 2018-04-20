import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import PowerFeedbackHandler from '../../events/handlers/device/common/powerstatus/powerFeedbackHandler';

import PowerFeedbackRules from './powerFeedbackRules';

chai.should();
const expect = chai.expect();

describe('Power feedback rules', () => {
  let ruleEngine;
  let powerFeedbackHandler;

  beforeEach(() => {
    powerFeedbackHandler = PowerFeedbackHandler();

    sinon.stub(powerFeedbackHandler);

    ruleEngine = new EventsRuleEngine();
    PowerFeedbackRules(ruleEngine, {
      powerFeedbackHandler,
    });
  });

  context('S6 Fresnel device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {
      const event = {
        GatewayId: 'CASAFG',
        Type: 'FRESNEL_POWER_FEEDBACK',
        Payload: {
          topic: 'building/room1/events/00:11:22:33:44:55/power',
          deviceId: '00:11:22:33:44:55',
          status: 'on',
        },
      };

      ruleEngine.handle(event);

      powerFeedbackHandler.process
        .calledOnce.should.be.true;
      powerFeedbackHandler.process
        .calledWith()
        .should.be.true;

    });
  });

  context('S6 Fresnel device with Type from Topic', () => {
    it('Should call deviceHandler\'s process passing right values', () => {
      const event = {
        GatewayId: 'CASAFG',
        Type: 'events_power',
        Payload: {
          topic: 'building/room1/events/00:11:22:33:44:55/power',
          deviceId: '00:11:22:33:44:55',
          status: 'on',
        },
      };

      ruleEngine.handle(event);

      powerFeedbackHandler.process
        .calledOnce.should.be.true;
      powerFeedbackHandler.process
        .calledWith()
        .should.be.true;

    });
  });

  context('Sonoff device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {
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
  });
});
