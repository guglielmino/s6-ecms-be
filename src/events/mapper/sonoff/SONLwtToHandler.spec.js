import chai from 'chai';

import SONLwtToHandler from './SONLwtToHandler';

chai.should();

describe('SONOFF LWT event to handler format', () => {

  it('should transform raw paylad to hadnler required one', () => {
    const rawPayload =  {
      GatewayId: 'TESTGW',
      Type: 'LWT',
      Payload: {
        Topic: 'tele/lamp3/LWT',
        Status: 'Online',
        DeviceId: '12:22:44:1a:d6:fa',
      },
    };

    const mapped = SONLwtToHandler(rawPayload);
    mapped.deviceId.should.be.eq('12:22:44:1a:d6:fa');
    mapped.status.should.be.eq('Online');

  });
});
