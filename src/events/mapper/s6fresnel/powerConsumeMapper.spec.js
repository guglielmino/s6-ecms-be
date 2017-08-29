import chai from 'chai';
import sinon from 'sinon';

import powerConsumeMapper from './powerConsumeMapper';

chai.should();
const expect = chai.expect;

describe('S6 Fresnel info message mapper', () => {
  it('should add created date', () => {
    const rawPayload = {
      GatewayId: 'CASAFG',
      Type: 'FRESNEL_POWER_CONSUME',
      Payload: {
        topic: 'building/room1/sensors/00:11:22:33:44:55/power',
        deviceId: '00:11:22:33:44:55',
        timestamp: '2017-08-27T07:56:23.642Z',
        power: 23.2,
      },
    };

    const result = powerConsumeMapper(rawPayload);

    result.Payload.created.should.be.an('Date');
  });
});
