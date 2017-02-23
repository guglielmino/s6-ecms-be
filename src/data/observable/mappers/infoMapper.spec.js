'use strict';

import chai from 'chai';
import sinon from 'sinon';
import {
	EVENT_TYPE_INFO
} from '../../../../consts';

import infoMapper, { SONOFF_POW } from './infoMapper';

chai.should();
const expect = chai.expect;

describe('info message mapper', () => {

	it('should add default deviceId when there isn\'t', () => {
		let rawPayload = {
			GatewayId: "testGateway",
			Type: EVENT_TYPE_INFO,
			Payload: {
				AppName: SONOFF_POW,
				Version: "1.2.3",
				FallbackTopic: "sonoffback",
				GroupTopic: "sonoff",
				Topic: "cmnd/sonoff"
			}
		};

		let result = infoMapper(rawPayload);

		result.Payload.deviceId.should.be.eq('00:00:00:00:00:00');
	});

	it('should add specific command when device type is SONOFF_POW', () => {
		let rawPayload = {
			GatewayId: "testGateway",
			Type: EVENT_TYPE_INFO,
			Payload: {
				AppName: SONOFF_POW,
				Version: "1.2.3",
				FallbackTopic: "sonoffback",
				GroupTopic: "sonoff",
				Topic: "cmnd/sonoff"
			}
		};

		let result = infoMapper(rawPayload);

		result.Payload.commands.length.should.be.eq(1);
		result.Payload.commands[0].power.should.be.eq('mqtt:cmnd/sonoff/POWER')
	});

});
