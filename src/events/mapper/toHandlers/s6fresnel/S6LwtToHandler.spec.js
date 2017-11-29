import chai from 'chai';

import S6LwtToHandler from './S6LwtToHandler';

chai.should();

describe('S6 fresnel LWT event to handler format', () => {

  it('should transform raw paylad to hadnler required one', () => {
    const rawPayload =  {
      GatewayId: 'TESTGW',
      Type: 'LWT',
      Payload: {
        Topic: 'building/room1/events/esp32_0F0738/lwt',
        status: 'Online',
        deviceId: '12:22:44:1a:d6:fa',
      },
    };

    const mapped = S6LwtToHandler(rawPayload);
    mapped.deviceId.should.be.eq('12:22:44:1a:d6:fa');
    mapped.status.should.be.eq('Online');
  });
});
