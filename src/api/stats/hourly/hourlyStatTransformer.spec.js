'use strict';

import chai from 'chai';
import sinon from 'sinon';

import { transformHourlyStat } from './hourlyStatTransformer';

chai.should();
const expect = chai.expect;

describe('hourly stat transformer', () => {

	it('should transform stat in response object', () => {
		let res = transformHourlyStat({
			_id: 12,
			Current: 20.46,
			Power: 0
		});

		res.hour.should.be.eq(12);
		res.current.should.be.eq(20.46);
		res.power.should.be.eq(0);
		Object.keys(res).length.should.be.eq(3);
	});
});