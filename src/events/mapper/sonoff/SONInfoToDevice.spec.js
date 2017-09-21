import chai from 'chai';

import {
  EVENT_TYPE_INFO,
} from '../../../../consts';

import SONInfoToDevice, { SONOFF_POW } from './SONInfoToDevice';

chai.should();
const expect = chai.expect;

describe('info message mapper', () => {
  it('should add default deviceId when there isn\'t', () => {
    const rawpayload = {
      GatewayId: 'testGateway',
      Type: EVENT_TYPE_INFO,
      Payload: {
        AppName: SONOFF_POW,
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'gdevs',
        Topic: 'cmnd/sonoff',
      },
    };

    const result = SONInfoToDevice(rawpayload);

    result.payload.deviceId.should.be.eq('00:00:00:00:00:00');
  });

  it('should add specific command when device type is SONOFF_POW', () => {
    const rawpayload = {
      GatewayId: 'testGateway',
      Type: EVENT_TYPE_INFO,
      Payload: {
        AppName: SONOFF_POW,
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'sonoff',
        DeviceId: '2d:5f:22:99:73:d5',
        Topic: 'cmnd/sonoff',
      },
    };

    const result = SONInfoToDevice(rawpayload);

    Object.keys(result.payload.commands).length.should.be.eq(1);
    result.payload.commands.power.should.be.eq('mqtt:cmnd/sonoff/POWER');
  });


  it('should map all required fields in result object payload', () => {
    const rawpayload = {
      GatewayId: 'testGateway',
      Type: EVENT_TYPE_INFO,
      Payload: {
        AppName: SONOFF_POW,
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'sogroup',
        DeviceId: '2d:5f:22:99:73:d5',
        Topic: 'cmnd/sonoff',
      },
    };

    const result = SONInfoToDevice(rawpayload);

    result.payload.gateway.should.be.eq('testGateway');
    result.payload.deviceType.should.be.eq(SONOFF_POW);
    result.payload.deviceId.should.be.eq('2d:5f:22:99:73:d5');
    result.payload.name.should.be.eq('sonoff');
    result.payload.description.should.be.eq('sonoff');
    result.payload.swVersion.should.be.eq('1.2.3');
    Object.keys(result).length.should.be.eq(2)
    Object.keys(result.payload).length.should.be.eq(8);
  });

  it('should map name of device', () => {
    const rawpayload = {
      GatewayId: 'testGateway',
      Type: EVENT_TYPE_INFO,
      Payload: {
        AppName: SONOFF_POW,
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'sonoff',
        DeviceId: '2d:5f:22:99:73:d5',
        Topic: 'cmnd/myname',
      },
    };

    const result = SONInfoToDevice(rawpayload);

    result.payload.name.should.be.eq('myname');
  });
});
