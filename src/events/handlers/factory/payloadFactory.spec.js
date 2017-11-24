import chai, { expect } from 'chai';
import sinon from 'sinon';
import PayloadFactory from './payloadFactory';
import S6FresnelUpdateFirmwareCommandToGateway from '../../mapper/toGateway/s6fresnel/S6FresnelUpdateFirmwareCommandToGateway';
import SONUpdateFirmwareCommandToGateway from '../../mapper/toGateway/sonoff/SONUpdateFirmwareCommandToGateway';

import S6FresnelPowerCommandToGateway from '../../mapper/toGateway/s6fresnel/S6FresnelPowerCommandToGateway';
import SONPowerCommandToGateway from '../../mapper/toGateway/sonoff/SONPowerCommandToGateway';

chai.should();

describe('payload factory', () => {

  it('should create payload mapper for device types', () => {
    const factory = new PayloadFactory();
    factory.devicesCommands.should.contains.all.keys('firmwareUpdate', 'powerSwitch');
    factory.devicesCommands.firmwareUpdate.should.contains.all.keys('sonoff', 'S6 Fresnel Module');
    factory.devicesCommands.powerSwitch.should.contains.all.keys('sonoff', 'S6 Fresnel Module');

    factory.devicesCommands.firmwareUpdate.sonoff.should.equal(SONUpdateFirmwareCommandToGateway);
    factory.devicesCommands.powerSwitch.sonoff.should.equal(SONPowerCommandToGateway);

    factory.devicesCommands.powerSwitch['S6 Fresnel Module'].should.equal(S6FresnelPowerCommandToGateway);
    factory.devicesCommands.firmwareUpdate['S6 Fresnel Module'].should.equal(S6FresnelUpdateFirmwareCommandToGateway);
  });

  it('should call correct power switch payload mapper based on device', () => {
    const factory = new PayloadFactory();
    const fakeDevSonoff = { deviceType: 'sonoff', name: 'test', commands: { power: '' } };
    const fakeDevS6Fresnel = { deviceType: 'S6 Fresnel Module', name: 'test s6 fresnel', commands: { power: '' } };

    const spyMapperFunctionSONOff = sinon.spy(factory.devicesCommands.powerSwitch, 'sonoff');
    const spyMapperFunctionS6Fresnel = sinon.spy(factory.devicesCommands.powerSwitch, 'S6 Fresnel Module');

    factory.createPowerSwitchPayload(fakeDevSonoff, '1');
    spyMapperFunctionSONOff.calledOnce.should.equal(true);
    spyMapperFunctionS6Fresnel.called.should.equal(false);
    spyMapperFunctionSONOff.args[0][0].should.equal(fakeDevSonoff, '1');

    factory.createPowerSwitchPayload(fakeDevS6Fresnel, '1');
    spyMapperFunctionS6Fresnel.calledOnce.should.equal(true);
    spyMapperFunctionS6Fresnel.args[0][0].should.equal(fakeDevS6Fresnel, '1');
  });

  it('should call correct firmware update payload mapper based on device', () => {
    const factory = new PayloadFactory();
    const fakeDevSonoff = { deviceType: 'sonoff', name: 'test' };
    const fakeDevS6Fresnel = { deviceType: 'S6 Fresnel Module', name: 'test s6 fresnel' };

    const spyMapperFunctionSONOff = sinon.spy(factory.devicesCommands.firmwareUpdate, 'sonoff');
    const spyMapperFunctionS6Fresnel = sinon.spy(factory.devicesCommands.firmwareUpdate, 'S6 Fresnel Module');

    factory.createFirmwareUpdatePayload(fakeDevSonoff);
    spyMapperFunctionSONOff.calledOnce.should.equal(true);
    spyMapperFunctionS6Fresnel.called.should.equal(false);
    spyMapperFunctionSONOff.args[0][0].should.equal(fakeDevSonoff);

    factory.createFirmwareUpdatePayload(fakeDevS6Fresnel);
    spyMapperFunctionS6Fresnel.calledOnce.should.equal(true);
    spyMapperFunctionS6Fresnel.args[0][0].should.equal(fakeDevS6Fresnel);
  });
});
