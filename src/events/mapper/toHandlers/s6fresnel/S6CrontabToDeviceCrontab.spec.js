import chai from 'chai';
import sinon from 'sinon';

import S6CrontabToDeviceCrontab from './S6CrontabToDeviceCrontab';

chai.should();
const expect = chai.expect;

describe('S6 Fresnel crontab message mapper', () => {
  it('should add default deviceId when there isn\'t', () => {
    const rawPayload =
      {
        GatewayId: 'CASAFG',
        Type: 'events_crontab',
        Payload: {
          topic: 'building/room1/events/esp32_03B674/crontab',
          deviceId: 'esp32_03B674',
          items: [
            {
              id: 1,
              at: '*/60 * * * * *',
              enable: true,
              action: 'readSensors',
            },
            {
              id: 2,
              at: '0 59 23 * * *',
              enable: true,
              action: 'resetKWh',
            },
          ],
        },
      };

    const result = S6CrontabToDeviceCrontab(rawPayload);

    result.deviceId.should.be.eq('esp32_03B674');
    result.payload.crontab.should.be.an('array');
    result.payload.crontab.length.should.be.eq(2);

  });

});
