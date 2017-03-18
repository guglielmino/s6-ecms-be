import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import GatewaysProvider from './gatewaysProvider';

chai.should();
const expect = chai.expect;

describe('gatewayProvider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('gateways', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should returns array of gateways', (done) => {

    subject = GatewaysProvider(db);
    subject
      .add({
        code: "zara2",
        description: "Negozio Zara 2, Milano"
      })
      .then(res => subject.add({
        code: "zara1",
        description: "Negozio Zara 1, Milano"
      }))
      .then(res => subject.add({
        code: "DevelopmentGateway",
        description: "Test gateway"
      }))
      .then(res => subject.getGateways(['DevelopmentGateway', 'zara1', 'zara2']))
      .then((res) => {
        res.length.should.be.eq(3);
        done();
      })
      .catch(err => done(err));
  })

});
