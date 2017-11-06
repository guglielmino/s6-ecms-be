import chai from 'chai';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';

import queryStringPaging from './query-string-paging-middleware';
import * as consts from '../../../consts';

chai.should();
const expect = chai.expect;

describe('Query string paging middleware', () => {
  let request = {};
  let response = {};

  it('should define pagedData on response object', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/test/path?myid=312',
    });
    response = httpMocks.createResponse();

    queryStringPaging()(request, response, function next(error) {
      response.pagedData.should.not.be.undefined;
      done();
    });
  });

  context('Pagination object', () => {
    it('should set pageSize according to query string', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?pageSize=10',
      });
      response = httpMocks.createResponse();

      queryStringPaging()(request, response, function next(error) {
        request.pagination.should.be.deep.equal({ pageSize: 10, lastObjectId: undefined });
        response.pagedData.should.not.be.undefined;
        done();
      });
    });

    it('should set pageSize and lastObjectId according to query string', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?pageSize=10&lastObjectId=123',
      });
      response = httpMocks.createResponse();

      queryStringPaging()(request, response, function next(error) {
        request.pagination.should.be.deep.equal({ pageSize: 10, lastObjectId: '123' });
        response.pagedData.should.not.be.undefined;
        done();
      });
    });

    it('should limit pageSize to maximum value set in constants', (done) => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?pageSize=100000&lastObjectId=123',
      });
      response = httpMocks.createResponse();

      queryStringPaging()(request, response, function next(error) {
        request.pagination.should.be.deep.equal({ pageSize: consts.PAGING_MAX_PAGE_SIZE, lastObjectId: '123' });
        response.pagedData.should.not.be.undefined;
        done();
      });
    });
  });
});
