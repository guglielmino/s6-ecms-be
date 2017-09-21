import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DeviceHandler from '../../events/handlers/device/common/info/deviceHandler';

import DeviceInfoRules from './deviceInfo';

chai.should();
const expect = chai.expect();

describe('Device Info rules', () => {
  let ruleEngine;
  let deviceHandler;

  beforeEach(() => {
    deviceHandler = DeviceHandler();

    sinon.stub(deviceHandler);

    ruleEngine = new EventsRuleEngine();
    DeviceInfoRules(ruleEngine, {
      deviceHandler,
    });
  });

  context('S6 Fresnel device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {

    });
  });

  context('Sonoff device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {


    });


  });
});
