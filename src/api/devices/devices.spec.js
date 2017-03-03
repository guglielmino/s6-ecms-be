'use strict';

import chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';

import Devices from './';
import Server from '../';
import App from '../express-setup';

chai.should();
const expect = chai.expect;

const Auth = () => () => (req, res, next) => {
	next();
};


describe('devices API endpoints', () => {

	let server;
	let app;
	let deviceProvider = {};

	beforeEach((done) => {
		app = App();
		app.use('/api/devices', Devices(Auth, Auth, { deviceProvider }));

		server = Server(
			{ server: { host: '0.0.0.0', port: 8901 } },
			app
		);

		done();
	});

	afterEach((done) => {

		server.close(done);

	});


	it('should returns devices with required fields', (done) => {

		deviceProvider.getDevices = sinon.stub().returns(Promise.resolve({
			name: 'Sample',
			deviceType: 'Sonoff Pow Module'
		}));

		request(server)
			.get('/api/devices/SampleGateway')
			.expect(200, done);
	});

});