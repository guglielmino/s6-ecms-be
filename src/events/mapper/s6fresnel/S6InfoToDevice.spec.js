import chai from 'chai';
import sinon from 'sinon';

import S6InfoToDevice from './s6InfoToDevice';

chai.should();
const expect = chai.expect;

describe('S6 Fresnel info message mapper', () => {
  it('should add default deviceId when there isn\'t', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_INFO',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:55/info',
        appName: 'S6 Fresnel Module',
        version: '0.0.1',
        location: 'room1',
        name: 'lampada ingresso',
      },
    };

    const result = S6InfoToDevice(rawPayload);

    result.deviceId.should.be.eq('00:00:00:00:00:00');
  });

  it('should add specific command when device type is S6 Fresnel Module', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_INFO',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:55/info',
        deviceId: '00:11:22:33:44:55',
        appName: 'S6 Fresnel Module',
        version: '0.0.1',
        location: 'room1',
        name: 'lampada ingresso',
      },
    };

    const result = S6InfoToDevice(rawPayload);

    Object.keys(result.payload.commands).length.should.be.eq(1);
    result.payload.commands.power.should.be.eq('mqtt:building/room1/devices/00:11:22:33:44:55/power');
  });


  it('should map all required fields in result object Payload', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_INFO',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:55/info',
        deviceId: '00:11:22:33:44:55',
        appName: 'S6 Fresnel Module',
        version: '0.0.1',
        location: 'room1',
        name: 'lampada ingresso',
      },
    };

    const result = S6InfoToDevice(rawPayload);

    result.payload.gateway.should.be.eq('CASAFG');
    result.payload.deviceType.should.be.eq('S6 Fresnel Module');
    result.payload.deviceId.should.be.eq('00:11:22:33:44:55');
    result.payload.name.should.be.eq('lampada ingresso');
    result.payload.description.should.be.eq('lampada ingresso');
    result.payload.swVersion.should.be.eq('0.0.1');
    Object.keys(result).length.should.be.eq(2);
    Object.keys(result.payload).length.should.be.eq(8);
  });

});
