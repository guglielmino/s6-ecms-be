import sinon from 'sinon';
import chai from 'chai';


import * as consts from '../../../consts';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import FirmwareUpdateHandler from '../../events/handlers/internal/api/firmwareUpdateHandler';
import ApiFirmwareUpdateRules from './api-firmware-update';

chai.should();
const expect = chai.expect();

describe('API generate firmware update event', () => {
  let ruleEngine;
  let firmwareUpdateHandler;

  beforeEach(() => {
    firmwareUpdateHandler = FirmwareUpdateHandler();

    sinon.stub(firmwareUpdateHandler);

    ruleEngine = new EventsRuleEngine();
    ApiFirmwareUpdateRules(ruleEngine, {
      firmwareUpdateHandler,
    });
  });

  it('Should call \'process\' of every handler for an api generated Firmware update message', () => {
    const message = {
      command: consts.APPEVENT_TYPE_FIRMWARE,
      gateway: 'TESTGW',
      param: '1',
    };

    ruleEngine.handle(message);

    firmwareUpdateHandler.process
      .calledOnce.should.be.true;
  });

  it('Should NOT call \'process\' of every handler for a generic message', () => {

    const message = {
      command: 'A TEST MESSAGE',
      gateway: 'TESTGW',
      param: 'a sample param',
    };

    ruleEngine.handle(message);

    firmwareUpdateHandler.process
      .calledOnce.should.be.false;
  });
});
