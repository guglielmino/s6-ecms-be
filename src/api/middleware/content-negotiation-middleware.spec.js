import chai from 'chai';
import sinon from 'sinon';

import contentNegotiation from './content-negotiation-middleware';
import httpMocks from 'node-mocks-http';

chai.should();
const expect = chai.expect;


describe('Content negotiation middleware test', () => {
  let request = {};
  let response = {};

  context('Response based on Accept header', () => {

    it('should define sendData function in response object', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        headers: {
          accept: 'application/json',
        },
      });
      response = httpMocks.createResponse();

      contentNegotiation()(request, response, function next(error) {
        response.sendData.should.not.be.undefined;
        done();
      });
    });
  });
});
