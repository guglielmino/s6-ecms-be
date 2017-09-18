import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import express from 'express';
import mockery from "mockery";
import bodyParser from 'body-parser';
import { FakeAuthMiddleware } from '../../test-helper';
import Gateways from './index';

import { GatewaysProvider } from '../../../data/mongodb/index';

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});

describe('Gateway API endpoints', () => {
  let request;
  let app;
  let gatewayProvider;

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: console.log });

    app = express();
    app.use(bodyParser.json());
    request = supertest(app);

    const db = {
      collection: () => {
      }
    };
    gatewayProvider = GatewaysProvider(db);
  });

  it('should returns requested gateway', (done) => {
    const date = new Date();

    sinon.stub(gatewayProvider, 'getGateways')
      .returns(Promise.resolve(
        [{
          _id: '589334a6734d1d44bec9d20d',
          code: 'gwtest',
          description: 'Negozio Zara, Milano',
          authKey: 'tttttt0',
        }]),
      );

    Gateways(app, [FakeAuthMiddleware(['gwtest', 'gwtest2', 'gwtest3'])()], { gatewayProvider });

    request
      .get('/api/gateways/gwtest')
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          gatewayProvider.getGateways.calledWith(['gwtest'])
            .should.be.true;

          const response = res.body;
          response.length.should.be.eq(1);
          response[0].code.should.be.eq('gwtest');
          response[0].description.should.be.eq('Negozio Zara, Milano');
          response[0].id.should.be.eq('589334a6734d1d44bec9d20d');
          response[0].authKey.should.be.eql('tttttt0');

          done();
        }
      });
  });

  it('should accept gateway description change', (done) => {
    const getGatewayStub = sinon.stub(gatewayProvider, 'getGateway')
      .returns(Promise.resolve({
          description: 'Sample description',
          code: 'samplegw',
          authKey: '0123nhjk,',
        }),
      );

    sinon.stub(gatewayProvider, 'updateByGatewayCode')
      .returns(Promise.resolve({ status: true, id: 'aaasaaa' }));

    Gateways(app, [FakeAuthMiddleware(['samplegw'])()], { gatewayProvider });      

    request
      .patch('/api/gateways/samplegw')
      .send({ op: 'replace', path: '/description', value: 'new descripion' })
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          gatewayProvider.updateByGatewayCode
            .calledWith('samplegw', sinon.match({ description: 'new descripion' }))
            .should.be.true;
          done();
        }
      });
  });

  it('should NOT accept gateway code change', (done) => {
    const getGatewayStub = sinon.stub(gatewayProvider, 'getGateway')
      .returns(Promise.resolve({
          description: 'Sample description',
          code: 'samplegw',
          authKey: '0123nhjk,',
        }),
      );

    sinon.stub(gatewayProvider, 'updateByGatewayCode')
      .returns(Promise.resolve({ status: true, id: 'aaasaaa' }));

    Gateways(app, [FakeAuthMiddleware(['samplegw'])()], { gatewayProvider });

    request
      .patch('/api/gateways/samplegw')
      .send({ op: 'replace', path: '/code', value: 'new descripion' })
      .expect(400, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

});
