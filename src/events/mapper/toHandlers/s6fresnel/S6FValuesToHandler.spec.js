import chai from 'chai';

import S6FValuesToHandler from './S6FValuesToHandler';

chai.should();

describe('S6 Fresnel Istant Power Payload to Hourly Stat', () => {

  it('should transform raw paylad to hourly stat one', () => {
    const rawPayload = {
      GatewayId: 'GTWTEST',
      Type: 'FRESNEL_VOLTAGE',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:99/voltage',
        deviceId: '00:11:22:33:44:99',
        timestamp: '2017-08-27T07:56:23.642Z',
        value: 23.2,
        unit: 'V',
      },
    };

    const mapped = S6FValuesToHandler(rawPayload);

    mapped.deviceId.should.be.eq('00:11:22:33:44:99');
    mapped.gateway.should.be.eq('GTWTEST');
    mapped.timestamp.should.be.eq('2017-08-27T07:56:23.642Z');
    mapped.value.should.be.eq(23.2);
    mapped.unit.should.be.eq('V');
    mapped.type.should.be.eq('FRESNEL_VOLTAGE');
  });
});
