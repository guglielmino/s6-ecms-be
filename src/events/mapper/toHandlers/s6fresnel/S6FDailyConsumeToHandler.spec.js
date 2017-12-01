import chai from 'chai';

import S6FDailyConsumeToHandler from './S6FDailyConsumeToHandler';

chai.should();

describe('S6 Fresnel Daily Consume Payload to Daily Stat', () => {

  it('should transform raw paylad to daily stat one', () => {
    const rawPayload = {
      GatewayId: 'GTWTEST',
      Type: 'FRESNEL_VOLTAGE',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:99/dailyconsume',
        deviceId: '00:11:22:33:44:99',
        timestamp: '2017-12-27T07:56:23.642Z',
        value: 10.2,
        unit: 'kWh',
      },
    };

    const mapped = S6FDailyConsumeToHandler(rawPayload);

    mapped.deviceId.should.be.eq('00:11:22:33:44:99');
    mapped.gateway.should.be.eq('GTWTEST');
    mapped.timestamp.should.be.eq('2017-12-27T07:56:23.642Z');
    mapped.dailyconsume.should.be.eq(10.2);
  });
});
