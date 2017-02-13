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
			deviceId: "87-af-3e-81-ea-39",
			gateway: "zara1",
			name: "Lampada 1 - primo piano",
			commands: [
				{
					power: "mqtt:cmnd/lamp1/POWER"
				}
			]
		});

		res.name.should.be.eq("Lampada 1 - primo piano");
		Object.keys(res).length.should.be.eq(2);
	});
});