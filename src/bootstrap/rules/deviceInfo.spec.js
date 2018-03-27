import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DeviceHandler from '../../events/handlers/device/common/info/deviceHandler';
import DeviceGroupsHandler from '../../events/handlers/device/common/info/deviceGroupsHandler';

import DeviceInfoRules from './deviceInfo';

chai.should();
const expect = chai.expect();

describe('Device Info rules', () => {
  let ruleEngine;
  let deviceHandler;
  let deviceGroupsHandler;

  beforeEach(() => {
    deviceHandler = DeviceHandler();
    deviceGroupsHandler = DeviceGroupsHandler();

    sinon.stub(deviceHandler);
    sinon.stub(deviceGroupsHandler);

    ruleEngine = new EventsRuleEngine();
    DeviceInfoRules(ruleEngine, {
      deviceHandler,
      deviceGroupsHandler,
    });
  });

  context('S6 Fresnel device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {
      const msg = {
        Type: 'FRESNEL_INFO',
        GatewayId: 'gw',
        Payload: {
          name: 'test',
          description: 'desc',
          version: '1.1.0',
          appName: 'S6 fresnel',
          deviceId: '00:00:00:00:00:02',
          group: 'group',
          created: new Date(),
        },
      };
      ruleEngine.handle(msg);

      deviceHandler.process.calledOnce.should.be.true;
      deviceHandler.process.calledWith({
        deviceId: '00:00:00:00:00:02',
        payload: {
          name: 'test',
          description: 'test',
          gateway: 'gw',
          swVersion: '1.1.0',
          deviceType: 'S6 fresnel',
          deviceId: '00:00:00:00:00:02',
          group: 'group',
          features: [],
          commands: { power: 'mqtt:building/group/devices/00:00:00:00:00:02/power' },
          created: sinon.match.date,
        },
      }).should.be.true;
    });

    it('Should call deviceGroupsHandlers\' process', () => {
      const msg = {
        Type: 'FRESNEL_INFO',
        GatewayId: 'gw',
        Payload: {
          name: 'test',
          description: 'desc',
          version: '1.1.0',
          appName: 'S6 fresnel',
          deviceId: '00:00:00:00:00:02',
          group: 'group',
          created: new Date(),
        },
      };
      ruleEngine.handle(msg);

      deviceGroupsHandler.process.calledOnce.should.be.true;
      deviceGroupsHandler.process.calledWith({
        code: 'group',
        payload: {
          gateway: 'gw',
          description: 'group',
          created: sinon.match.date,
        },
      }).should.be.true;
    });
  });

  context('Sonoff device', () => {
    it('Should call deviceHandler\'s process passing right values', () => {


    });


  });
});
