'use strict';

import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../consts';
import messageMediator from './messageMediator';

chai.should();
const expect = chai.expect;

describe('message mediator', () => {
	let subject;
	let fnEnergy, fnInfo;

	beforeEach(() => {
		fnEnergy = () => {};
		fnInfo = () => {};
		subject = messageMediator();
		subject.addHandler(consts.EVENT_TYPE_ENERGY, fnEnergy);
		subject.addHandler(consts.EVENT_TYPE_INFO, fnInfo);

	});

	it('should process EVENT_TYPE_ENERGY message', () => {
		let fn = subject.process({ Type: consts.EVENT_TYPE_ENERGY });
		fn.should.be.eq(fnEnergy);
		fn.should.be.not.eq(fnInfo);

	});

	it('should process EVENT_TYPE_INFO message', () => {
		let fn = subject.process({ Type: consts.EVENT_TYPE_INFO });
		fn.should.be.not.eq(fnEnergy);
		fn.should.be.eq(fnInfo);
	});

	it('should do nothing for an unknown message type', () => {
		let fn = subject.process({ Type: 'FAKE_EVENT' });
		expect(fn).to.be.null;
	});

});