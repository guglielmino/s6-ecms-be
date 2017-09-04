import chai from 'chai';
import sinon from 'sinon';

import infoMapper from './infoMapper';

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

    const result = infoMapper(rawPayload);

    result.Payload.deviceId.should.be.eq('00:00:00:00:00:00');
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

    const result = infoMapper(rawPayload);

    Object.keys(result.Payload.commands).length.should.be.eq(1);
    result.Payload.commands.power.should.be.eq('mqtt:building/room1/devices/00:11:22:33:44:55/power');
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

    const result = infoMapper(rawPayload);

    result.Payload.gateway.should.be.eq('CASAFG');
    result.Payload.deviceType.should.be.eq('S6 Fresnel Module');
    result.Payload.deviceId.should.be.eq('00:11:22:33:44:55');
    result.Payload.name.should.be.eq('lampada ingresso');
    result.Payload.description.should.be.eq('lampada ingresso');
    result.Payload.swVersion.should.be.eq('0.0.1');
    Object.keys(result).length.should.be.eq(2);
    Object.keys(result.Payload).length.should.be.eq(8);
  });

});
