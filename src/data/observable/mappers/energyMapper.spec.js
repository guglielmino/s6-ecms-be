'use strict';

import chai from 'chai';
import sinon from 'sinon';
import {
	EVENT_TYPE_ENERGY
} from '../../../../consts';

import energyMapper from './energyMapper';

chai.should();
const expect = chai.expect;

describe('energy message mapper', () => {

	it('should ma', () => {
		let rawPayload = {
			GatewayId: "testGateway",
			Type: EVENT_TYPE_ENERGY,
			Payload: {
				Current: 2.4,
				Yesterday: 2.0,
				Today: 11.2,
				Factor: 1,
				Time: "2017-02-16T14:51:12.651Z"
			}
		};

		let result = energyMapper(rawPayload);

		result.Payload.Current.should.be.eq(2.4);
		result.Payload.Time.should.be.a("Date");

	});

});