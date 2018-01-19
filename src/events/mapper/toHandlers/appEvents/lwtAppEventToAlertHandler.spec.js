import chai from 'chai';

import APPEventToHandler from './lwtAppEventToAlertHandler';

chai.should();
const expect = chai.expect;

describe('LWT APP event to alert handler mapper', () => {
  it('should transform raw payload to alert handler payload', () => {
    const msg = {
      type: 'AE_LWT_ALERT',
      status: 'Online',
      device: {
        _id: '5a60b016d611067462ea2fc5',
        deviceId: 'esp32_0F0A74',
        name: 'noname',
        gateway: 'VG59',
        swVersion: '0.0.7',
        deviceType: 'S6 Fresnel Module',
        location: 'room1',
        commands: {
          power: 'mqtt:building/room1/devices/esp32_0F0A74/power',
        },
        created: '2018-01-19T08:09:02.595Z',
        description: 'noname',
        status: {
          online: true,
        },
      },
    };

    const result = APPEventToHandler(msg);
    result.deviceId.should.be.eq('esp32_0F0A74');
    result.status.should.be.eq('Online');
    result.type.should.be.eq('Device_status');
    Object.keys(result).length.should.be.eq(3);
  });
});
