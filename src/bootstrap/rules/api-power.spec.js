import sinon from 'sinon';
import chai from 'chai';

import * as consts from '../../../consts';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import PowerStateHandler from '../../events/handlers/internal/api/powerStateHandler';
import PowerStateAlertHandler from '../../events/handlers/internal/api/powerStateAlertHandler';
import ApiPowerRules from './api-power';

chai.should();
const expect = chai.expect();

describe('API generated power event', () => {
  let ruleEngine;
  let powerStateHandler;
  let powerStateAlertHandler;

  beforeEach(() => {
    powerStateHandler = PowerStateHandler();
    powerStateAlertHandler = PowerStateAlertHandler();

    sinon.stub(powerStateHandler);
    sinon.stub(powerStateAlertHandler);

    ruleEngine = new EventsRuleEngine();
    ApiPowerRules(ruleEngine, {
      powerStateHandler,
      powerStateAlertHandler,
    });
  });


  it('Should call \'process\' of every handler for an api generated Power message', () => {
    const message = {
      command: consts.APPEVENT_TYPE_POWER,
      gateway: 'TESTGW',
      param: 'on',
    };

    ruleEngine.handle(message);

    powerStateHandler.process
      .calledOnce.should.be.true;

    powerStateAlertHandler.process
      .calledOnce.should.be.true;
  });


  it('Should NOT call \'process\' of every handler for a generic message', () => {
    const message = {
      command: 'A TEST MESSAGE',
      gateway: 'TESTGW',
      param: 'a sample param',
    };

    ruleEngine.handle(message);

    powerStateHandler.process
      .calledOnce.should.be.false;

    powerStateAlertHandler.process
      .calledOnce.should.be.false;
  });
});
