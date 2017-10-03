import chai from 'chai';

import S6StatusToHandler from './S6StatusToHandler';

chai.should();

describe('S6 Fresnel power feedback status message mapper', () => {

  it('should map all required fields in result object Payload', () => {
    const rawPayload =
      {
        GatewayId: 'CASAFG',
        Type: 'FRESNEL_POWER_FEEDBACK',
        Payload: {
          topic: 'building/room1/events/00:11:22:33:44:55/power',
          deviceId: '00:11:22:33:44:55',
          status: 'on'
        },
      };
    ;

    const mapped = S6StatusToHandler(rawPayload);
    mapped.deviceId.should.be.eq('00:11:22:33:44:55');
    mapped.powerStatus.should.be.eq('on');
  });


});
