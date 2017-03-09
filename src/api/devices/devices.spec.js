import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';

import { FakeAuthMiddleware } from '../test-helper';

//import Devices from './';
import express from 'express';
import mockery from "mockery";

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

describe('Devices API endpoints', () => {
  let request;
  let app;
  let Devices;


  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    Devices = require('./index').default;
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);
  });

  it('should returns devices with required fields', (done) => {
    const deviceProvider = {};
    Devices(app, FakeAuthMiddleware(['samplegw']), null, { deviceProvider });

    deviceProvider
      .getDevices = sinon
      .stub()
      .returns(Promise.resolve([{
          name: 'Sample',
          deviceId: '00:11:22:33:44:55',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }]),
      );

    request
      .get('/api/devices/samplegw')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].name.should.be.eq('Sample');
          response[0].deviceId.should.be.eq('00:11:22:33:44:55');
          response[0].type.should.be.eq('Sonoff Pow Module');
          response[0].version.should.be.eq('1.0');
          done();
        }
      });
  });


});