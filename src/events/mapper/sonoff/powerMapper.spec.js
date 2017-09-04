import chai from 'chai';
import sinon from 'sinon';
import powerMapper from './powerMapper';

chai.should();
const expect = chai.expect;

describe('power status message mapper', () => {
  it('should map power status payload ', () => {
    const rawPayload = {
      GatewayId: 'SAMPLE',
      Type: 'POWER_STATUS',
      Payload: {
        Topic: 'stat/sonoff/RESULT',
        Power: 'ON',
        DeviceId: '00:11:22:33:44:55',
      },
    };

    const result = powerMapper(rawPayload);

    result.Payload.Power.should.be.eq('on');
    result.Payload.Topic.should.be.eq('stat/sonoff/RESULT');
    result.Payload.DeviceId.should.be.eq('00:11:22:33:44:55');
  });
});
