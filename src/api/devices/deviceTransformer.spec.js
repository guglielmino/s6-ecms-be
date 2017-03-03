'use strict';

import chai from 'chai';
import sinon from 'sinon';

import {
	transformDevice
} from './deviceTransformer';

chai.should();
const expect = chai.expect;

describe('device transformer', () => {

	it('should transform device in response object', () => {
		let res = transformDevice({
			deviceId: '87:af:3e:81:ea:39',
			gateway: 'zara1',
			name: 'Lampada 1 - primo piano',
			deviceType: 'Sonoff Pow Module',
			swVersion: '1.0.2',
			commands: [
				{
					power: 'mqtt:cmnd/lamp1/POWER'
				}
			]
		});

		res.name.should.be.eq('Lampada 1 - primo piano');
		res.deviceId.should.be.eq('87:af:3e:81:ea:39');
		res.type.should.be.eq('Sonoff Pow Module');
		res.version.should.be.eq('1.0.2');
		Object.keys(res).length.should.be.eq(4);
	});
});