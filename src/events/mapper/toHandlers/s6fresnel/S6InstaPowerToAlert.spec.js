import chai from 'chai';

import S6InstaPowerToAlert from './S6InstaPowerToAlert';

chai.should();

describe('S6 Fresnel Istant Power Payload to Alert Handler', () => {

  it('should transform raw paylad to alertHandler one', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_POWER_CONSUME',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:55/power',
        deviceId: '00:11:22:33:44:55',
        timestamp: '2017-08-27T07:56:23.642Z',
        value: 23.2,
      },
    };

    const mapped = S6InstaPowerToAlert(rawPayload, 'testType');

    mapped.deviceId.should.be.eq('00:11:22:33:44:55');
    mapped.type.should.be.eq('Device_broken');
    Object.keys(mapped).length.should.be.eq(2);
  });

});
