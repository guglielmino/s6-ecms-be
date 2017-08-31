import chai from 'chai';
import sinon from 'sinon';

import powerFeedbackMapper from './powerFeedbackMapper';

chai.should();
const expect = chai.expect;

describe('S6 Fresnel power feedback message mapper', () => {
  it('should map all the mandatory fields', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_POWER_FEEDBACK',
      Payload: {
        topic: 'building/room1/events/00:11:22:33:44:55/power',
        deviceId: '00:11:22:33:44:55',
        status: 'on',
      },
    };

    const result = powerFeedbackMapper(rawPayload);

    result.Payload.status.should.be.equal('on');
    result.Payload.deviceId.should.be.equal('00:11:22:33:44:55');
  });
});
