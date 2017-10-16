import sinon from 'sinon';
import chai from 'chai';

import * as consts from '../../../consts';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import PowerSwitchFailAlertHandler from '../../events/handlers/internal/handler/powerSwitchFailAlertHandler';
import PowerSwitchFailAlertRules from './appEventsRules';

chai.should();
const expect = chai.expect();

describe('HANDLER generated power switch change alert event', () => {
  let ruleEngine;
  let powerSwitchFailAlertHandler;

  beforeEach(() => {
    powerSwitchFailAlertHandler = PowerSwitchFailAlertHandler();

    sinon.stub(powerSwitchFailAlertHandler);

    ruleEngine = new EventsRuleEngine();
    PowerSwitchFailAlertRules(ruleEngine, {
      powerSwitchFailAlertHandler,
    });
  });


  it('Should call \'process\' of every handler for an api generated Power message', () => {
    const message = {
      type: consts.APPEVENT_TYPE_POWER_ALERT,
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: 'off',
    };

    ruleEngine.handle(message);

    powerSwitchFailAlertHandler.process
      .calledOnce.should.be.true;
  });

  it('Should NOT call \'process\' of every handler for a generic message', () => {
    const message = {
      command: consts.APPEVENT_TYPE_POWER,
      gateway: 'TESTGW',
      param: 'on',
    };

    ruleEngine.handle(message);

    powerSwitchFailAlertHandler.process
      .calledOnce.should.be.false;

  });
});
