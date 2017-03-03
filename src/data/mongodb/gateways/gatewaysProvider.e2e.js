

import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import GatewaysProvider from './gatewaysProvider';

chai.should();
const expect = chai.expect;

describe('gatewayProvider', () => {
  let subject;

  it('should returns array of gateways', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });
    database.connect()
			.then((db) => {
  subject = GatewaysProvider(db);
  subject
					.getGateways(['DevelopmentGateway', 'zara1', 'zara2'])
					.then((res) => {
  res.length.should.be.eq(3);
  done();
})
					.catch(err => done(err));
})
			.catch(err => done(err));
  });
});
