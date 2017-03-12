

import chai from 'chai';
import sinon from 'sinon';
import {
	EVENT_TYPE_INFO,
} from '../../../../consts';

import infoMapper, { SONOFF_POW } from './infoMapper';

chai.should();
const expect = chai.expect;

describe('info message mapper', () => {
  it('should add default deviceId when there isn\'t', () => {
    const rawPayload = {
      GatewayId: 'testGateway',
      Type: EVENT_TYPE_INFO,
      Payload: {
        AppName: SONOFF_POW,
        Version: '1.2.3',
        FallbackTopic: 'sonoffback',
        GroupTopic: 'sonoff',
        Topic: 'cmnd/sonoff',
      },
    };

    const result = infoMapper(rawPayload);

    result.Payload.deviceId.should.be.eq('00:00:00:00:00:00');
  });

  it('should add specific command when device type is SONOFF_POW', () => {
    const rawPayload = {
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

    const result = infoMapper(rawPayload);

    Object.keys(result.Payload.commands).length.should.be.eq(1);
    result.Payload.commands.power.should.be.eq('mqtt:cmnd/sonoff/POWER');
  });


  it('should map all required fields in result object Payload', () => {
    const rawPayload = {
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

    const result = infoMapper(rawPayload);

    result.Payload.gateway.should.be.eq('testGateway');
    result.Payload.deviceType.should.be.eq(SONOFF_POW);
    result.Payload.deviceId.should.be.eq('2d:5f:22:99:73:d5');
  });
});
