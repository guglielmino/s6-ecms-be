import chai from 'chai';
import sinon from 'sinon';

import gatewayAuthMiddleware from './gateway-auth-middleware';
import httpMocks from 'node-mocks-http';

chai.should();
const expect = chai.expect;


describe('Middleware test', () => {
  let request = {};
  let response = {};

  context('Mandatory parameters required in HTTP header', () => {

    it('should respond 401 Unauthorized when x-s6-gatewayid and x-s6-auth-token headers are missing', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        headers: {},
        query: {
          myid: '312'
        }
      });
      response = httpMocks.createResponse();

      gatewayAuthMiddleware((gw, token) => Promise.resolve(true))(request, response, function next(error) {
        response.statusCode.should.be.eq(401);
        done();
      });
    });

    it('should respond 401 Unauthorized when x-s6-gatewayid header is missing', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
          myid: '312'
        }
      });
      request.headers['x-s6-auth-token'] = '123344';

      response = httpMocks.createResponse();

      gatewayAuthMiddleware((gw, token) => Promise.resolve(true))(request, response, function next(error) {
        response.statusCode.should.be.eq(401);
        done();
      });
    });

    it('should respond 401 Unauthorized when x-s6-auth-token header is missing', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
          myid: '312'
        }
      });
      request.headers['x-s6-gatewayid'] = 'CASAFG';

      response = httpMocks.createResponse();

      gatewayAuthMiddleware((gw, token) => Promise.resolve(true))(request, response, function next(error) {
        response.statusCode.should.be.eq(401);
        done();
      });
    });

    it('should respond 200 when all headers are present and they are validated', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
          myid: '312'
        }
      });
      request.headers['x-s6-gatewayid'] = 'CASAFG';
      request.headers['x-s6-auth-token'] = '123344';

      response = httpMocks.createResponse();

      gatewayAuthMiddleware((gw, token) => Promise.resolve(true))(request, response, function next(error) {
        response.statusCode.should.be.eq(200);
        done();
      });
    });

    it('should respond 401 when all headers are present BUT they aren\'t validated', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
          myid: '312'
        }
      });
      request.headers['x-s6-gatewayid'] = 'CASAFG';
      request.headers['x-s6-auth-token'] = '123344';

      response = httpMocks.createResponse();

      gatewayAuthMiddleware((gw, token) => Promise.resolve(false))(request, response, function next(error) {
        response.statusCode.should.be.eq(401);
        done();
      });
    });


  });


});
