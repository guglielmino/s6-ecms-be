import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';
import express from 'express';
import logger from '../../../common/logger';
import { FakeAuthMiddleware } from '../../test-helper';


chai.should();

describe('Device groups API endpoint', () => {
  let request;
  let app;
  let DeviceGroups;
  let deviceGroupsProvider;

  before(() => {
    sinon.stub(logger, 'log');

    DeviceGroups = require('./index').default;
  });

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);

    deviceGroupsProvider = {
      getGroups: () => {},
      getGroupByCode: () => {},
      update: () => {},
    };
  });

  it('should get all device groups related to specific gateway', (done) => {
    sinon.stub(deviceGroupsProvider, 'getGroups').returns(Promise.resolve([{
      code: 'group1',
      description: 'test device groups',
      gateway: 'samplegw',
    }]));

    DeviceGroups(app, [FakeAuthMiddleware(['samplegw'])()], { deviceGroupsProvider });

    request
      .get('/api/deviceGroups/?gw=samplegw')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          const response = res.body;
          response.length.should.be.eq(1);
          response[0].code.should.be.eq('group1');
          response[0].description.should.be.eq('test device groups');
          response[0].gateway.should.be.eq('samplegw');
          done();
        }
      });
  });

  it('should get 204 if no groups are provided', (done) => {
    sinon.stub(deviceGroupsProvider, 'getGroups').returns(Promise.resolve([]));

    DeviceGroups(app, [FakeAuthMiddleware(['samplegw'])()], { deviceGroupsProvider });

    request
      .get('/api/deviceGroups/?gw=samplegw')
      .expect(204, (err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('should accept device group description change', (done) => {
    const getDeviceStub = sinon.stub(deviceGroupsProvider, 'getGroupByCode')
      .returns(Promise.resolve({
        code: 'group1',
        description: 'test device groups',
        gateway: 'samplegw',
        }),
      );

    sinon.stub(deviceGroupsProvider, 'update')
      .returns(Promise.resolve({ status: true, id: '1234' }));

    DeviceGroups(app, [FakeAuthMiddleware(['samplegw'])()], { deviceGroupsProvider });

    request
      .patch('/api/deviceGroups/group1')
      .send({ op: 'replace', path: '/description', value: 'new descripion' })
      .expect(200, (err) => {
        if (err) {
          done(err);
        } else {
          deviceGroupsProvider.update
            .calledWith(sinon.match({code: 'group1'}), sinon.match({ description: 'new descripion' }))
            .should.be.true;
          done();
        }
      });
  });

  it('should reject device group change different from description', (done) => {
    DeviceGroups(app, [FakeAuthMiddleware(['samplegw'])()], { deviceGroupsProvider });

    request
      .patch('/api/deviceGroups/group1')
      .send({ op: 'replace', path: '/code', value: 'new descripion' })
      .expect(400, (err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  after(() => {
    logger.log.restore();
  });
});
