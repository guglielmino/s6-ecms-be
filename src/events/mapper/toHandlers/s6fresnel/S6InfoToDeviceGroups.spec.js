import chai from 'chai';
import sinon from 'sinon';

import S6InfoToDeviceGroups from './S6InfoToDeviceGroups';

chai.should();
const expect = chai.expect;

describe('S6 Fresnel info message to device groups mapper', () => {
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

    const result = S6InfoToDeviceGroups(rawPayload);

    result.code.should.be.eq('room1');
    result.payload.gateway.should.be.eq('CASAFG');
    result.payload.description.should.be.eq('room1');
  });
});
