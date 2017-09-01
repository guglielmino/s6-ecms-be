import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import PowerFeedbackHandler from '../../events/handlers/device/common/powerstatus/powerFeedbackHandler';

import S6PowerFeedbackRules from './s6fresnel-powerfeedback';

chai.should();
const expect = chai.expect();

describe('S6 Fresnel Power Feedback Rules', () => {
  let ruleEngine;
  let powerFeedbackHandler;

  beforeEach(() => {
    powerFeedbackHandler = PowerFeedbackHandler();

    sinon.stub(powerFeedbackHandler);

    ruleEngine = new EventsRuleEngine();
    S6PowerFeedbackRules(ruleEngine, {
      powerFeedbackHandler,
    });
  });

  it('Should call \'process\' of every handler for a Power Feedback message', () => {
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
  });

});
