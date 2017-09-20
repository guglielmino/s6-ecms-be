import chai from 'chai';

import SONDailyConsumeToDaily from './SONDailyConsumeToDaily';

chai.should();

describe('SONOFF Energy Payload to Daily Stat', () => {

  it('should transform raw paylad to hourly stat one', () => {
    const rawPayload =  {
      GatewayId: 'testGateway',
      Type: 'ENERGY',
      Payload: {
        DeviceId: '00:11:22:33:44:55',
        Power: 9,
        Current: 2.4,
        Yesterday: 2.0,
        Today: 11.2,
        Factor: 1,
        Time: '2017-02-16T14:51:12.651Z',
      },
    };

    const mapped = SONDailyConsumeToDaily(rawPayload);

    mapped.deviceId.should.be.eq('00:11:22:33:44:55');
    mapped.gateway.should.be.eq('testGateway');
    mapped.timestamp.should.be.eq('2017-02-16T14:51:12.651Z');
    mapped.dailyconsume.should.be.eq(11.2);
  });
});
