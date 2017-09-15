import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';
import express from 'express';
import mockery from 'mockery';

import { FakeAuthMiddleware } from '../../test-helper';

import { DevicesProvider } from '../../../data/mongodb';

chai.should();
const expect = chai.expect;

describe('Devices API endpoints', () => {
  let request;
  let app;
  let Devices;
  let deviceProvider;
  let emitter;

  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
    });

    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: () => {} });
    emitter = { emit: sinon.spy() };
    mockery.registerMock('../../../streams/emitter', emitter);

    Devices = require('./index').default;
  });

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);

    const db = {
      collection: () => { }
    };
    deviceProvider = DevicesProvider(db);
  });

  after(() => {
    mockery.disable();
  });

  it('should returns devices with required fields', (done) => {
    const getDevicesStub = sinon.stub(deviceProvider, 'getDevices')
      .returns(Promise.resolve([{
          name: 'Sample',
          gateway: 'samplegw',
          deviceId: '00:11:22:33:44:55',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }]),
      );

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .get('/api/devices/?gw=samplegw')
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

  it('should reject invalid payload', (done) => {
    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .post('/api/devices/11:22:33:44:55:66/command')
      .send({ gateway: 'samplegw', param: 'on' })
      .expect(400, (err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should reject invalid command', (done) => {
    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .post('/api/devices/11:22:33:44:55:66/command')
      .send({ command: 'TEST', gateway: 'samplegw', param: 'on' })
      .expect(400, (err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should process device command', (done) => {
    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .post('/api/devices/11:22:33:44:55:66/command')
      .send({ command: 'AE_POWER_STATE', gateway: 'samplegw', param: 'on' })
      .expect(200, (err) => {
        if (err) {
          done(err);
        } else {
          emitter.emit.calledWith(sinon.match.any,
            sinon.match({ command: 'AE_POWER_STATE' }))
            .should.be.true;
          done();
        }
      });
  });

  it('should get 403 for gateway not owned by user', (done) => {
    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .post('/api/devices/11:22:33:44:55:66/command')
      .send({ command: 'AE_POWER_STATE', gateway: 'XYZ', param: 'on' })
      .expect(403, (err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should get device data by deviceId', (done) => {
    const getDeviceStub = sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve({
          name: 'Sample',
          gateway: 'samplegw',
          deviceId: '11:22:33:44:55:66',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }),
      );

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .get('/api/devices/11:22:33:44:55:66')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          getDeviceStub.calledWith('11:22:33:44:55:66')
            .should.be.true;

          const response = res.body;
          response.deviceId.should.be.eq('11:22:33:44:55:66');
          response.name.should.be.eq('Sample');
          response.type.should.be.eq('Sonoff Pow Module');
          response.version.should.be.eq('1.0');
          done();
        }
      });
  });

  it('should get 404 when device doesn\'t exists', (done) => {
    sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve(null),
      );

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .get('/api/devices/11:22:33:44:55:66')
      .expect(404, (err, res) => {
        if (err) {
          done(err);
        } else {
           done();
        }
      });
  });

  it('should return 403 when device\'s gateway doesn\'t match user gateways' , (done) => {
    const getDeviceStub = sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve({
          name: 'Sample',
          gateway: 'testgw',
          deviceId: '11:22:33:44:55:66',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }),
      );

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .get('/api/devices/11:22:33:44:55:66')
      .expect(403, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });


  it('should accept device description change', (done) => {
    const getDeviceStub = sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve({
          name: 'Sample',
          description: 'Sample description',
          gateway: 'samplegw',
          deviceId: '11:22:33:44:55:66',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }),
      );

    sinon.stub(deviceProvider, 'updateByDeviceId')
      .returns(Promise.resolve({ status: true, id: 'aaasaaa' }));

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .patch('/api/devices/11:22:33:44:55:66')
      .send({ op: 'replace', path: '/description', value: 'new descripion' })
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          console.log(deviceProvider.updateByDeviceId.args);
          deviceProvider.updateByDeviceId
            .calledWith('11:22:33:44:55:66', sinon.match({ description: 'new descripion' }))
            .should.be.true;
          done();
        }
      });
  });


  it('should not accept device name change', (done) => {
    const getDeviceStub = sinon.stub(deviceProvider, 'findByDeviceId')
      .returns(Promise.resolve({
          name: 'Sample',
          description: 'Sample description',
          gateway: 'samplegw',
          deviceId: '11:22:33:44:55:66',
          deviceType: 'Sonoff Pow Module',
          swVersion: '1.0',
        }),
      );

    sinon.stub(deviceProvider, 'updateByDeviceId')
      .returns(Promise.resolve({ status: true, id: 'aaasaaa' }));

    Devices(app, [FakeAuthMiddleware(['samplegw'])()], { deviceProvider });

    request
      .patch('/api/devices/11:22:33:44:55:66')
      .send({ op: 'replace', path: '/name', value: 'new descripion' })
      .expect(400, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
