import chai from 'chai';

import S6FInstaPowerToHourly from './S6FInstaPowerToHourly';

chai.should();

describe('S6 Fresnel Istant Power Payload to Hourly Stat', () => {

  it('should transform raw paylad to hourly stat one', () => {
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

    const mapped = S6FInstaPowerToHourly(rawPayload);

    mapped.deviceId.should.be.eq('00:11:22:33:44:55');
    mapped.gateway.should.be.eq('CASAFG');
    mapped.timestamp.should.be.eq('2017-08-27T07:56:23.642Z');
    mapped.power.should.be.eq(23.2);
  });

});
