import sinon from 'sinon';
import chai from 'chai';

import * as consts from '../../../consts';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import FirmwareUpdateHandler from '../../events/handlers/internal/api/firmwareUpdateHandler';
import PowerStateAlertHandler from '../../events/handlers/internal/api/powerStateAlertHandler';
import PowerStateHandler from '../../events/handlers/internal/api/powerStateHandler';

import ApiFirmwareUpdateRules from './apiRules';

import { DevicesProvider } from '../../data/mongodb/index';

chai.should();
const expect = chai.expect();

describe('API generated event rules', () => {
  let ruleEngine;
  let firmwareUpdateHandler;
  let powerStateHandler;
  let powerStateAlertHandler;

  beforeEach(() => {

    const db = {
      collection: () => { },
    };

    const deviceProvider = DevicesProvider(db);
    const pnub = {};
    firmwareUpdateHandler = FirmwareUpdateHandler();
    powerStateHandler = PowerStateHandler(deviceProvider, pnub);
    powerStateAlertHandler = PowerStateAlertHandler();

    sinon.stub(firmwareUpdateHandler);
    sinon.stub(powerStateHandler);
    sinon.stub(powerStateAlertHandler);

    ruleEngine = new EventsRuleEngine();
    ApiFirmwareUpdateRules(ruleEngine, {
      firmwareUpdateHandler,
      powerStateHandler,
      powerStateAlertHandler,
    });
  });

  context('Firmware Update', () => {
    it('Should call \'process\' of every handler for an api generated Firmware update message', () => {
      const message = {
        command: consts.APPEVENT_TYPE_FIRMWARE,
        deviceId: '00:11:22:33:44:55',
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
        deviceId: '00:11:22:33:44:55',
        gateway: 'TESTGW',
        param: 'a sample param',
      };

      ruleEngine.handle(message);

      firmwareUpdateHandler.process
        .calledOnce.should.be.false;
    });
  });

  context('Power state', () => {
    it('Should call \'process\' of every handler for an api generated Power message', () => {
      const message = {
        command: consts.APPEVENT_TYPE_POWER,
        deviceId: '00:11:22:33:44:55',
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
        deviceId: '00:11:22:33:44:55',
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
});
