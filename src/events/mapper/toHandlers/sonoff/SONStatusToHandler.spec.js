import chai from 'chai';

import SONStatusToHandler from './SONStatusToHandler';

chai.should();

describe('SONOFF power status event to handler format', () => {

  it('should transform raw paylad to hourly stat one', () => {
    const rawPayload = {
      GatewayId: 'TESTGW',
      Type: 'POWER_STATUS',
      Payload: {
        Topic: 'stat/lamp3/RESULT',
        Power: 'off',
        PowerCommand: 'mqtt:cmnd/lamp3/POWER',
        DeviceId: '11:44:41:9f:66:ea',
      }
    };

    const mapped = SONStatusToHandler(rawPayload);
    mapped.deviceId.should.be.eq('11:44:41:9f:66:ea');
    mapped.powerStatus.should.be.eq('off');

  });
});
