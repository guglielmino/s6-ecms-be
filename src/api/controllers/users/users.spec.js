import chai from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import bodyParser from 'body-parser';
import express from 'express';
import Users from './';
import logger from '../../../common/logger';
import { FakeAuthMiddleware } from '../../test-helper';

chai.should();

describe('Users API endpoint', () => {
  let request;
  let app;
  let usersProvider;

  beforeEach(() => {
    sinon.stub(logger, 'log');
    usersProvider = {
      updateByUserId: () => {},
    };

    app = express();
    app.use(bodyParser.json());

    request = supertest(app);
  });

  it('should call provider to update user', (done) => {
     const stub = sinon.stub(usersProvider, 'updateByUserId')
      .returns(Promise.resolve(true));

    Users(app, [FakeAuthMiddleware(['gwtest'])()], { usersProvider });

    request.post('/api/users/12345')
      .send({
        userId: '678543',
        provider: 'auth0',
        email: 'secondemail@mail.com',
      })
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        } else {
          stub.called.should.be.true;
          stub.calledWith('12345', {
            userId: '678543',
            provider: 'auth0',
            email: 'secondemail@mail.com',
          }).should.be.true;
          done();
        }
      });
  });

  it('should return 204 if call to update user return false', (done) => {
    sinon.stub(usersProvider, 'updateByUserId')
      .returns(Promise.resolve(false));

    Users(app, [FakeAuthMiddleware(['gwtest'])()], { usersProvider });

    request.post('/api/users/12345')
      .send({
        userId: '678543',
        provider: 'auth0',
        email: 'secondemail@mail.com',
      })
      .expect(204, (err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  afterEach(() => {
    usersProvider.updateByUserId.restore();
    logger.log.restore();
  });
});
