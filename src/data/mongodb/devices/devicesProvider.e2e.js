

import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import DevicesProvider from './devicesProvider';

chai.should();
const expect = chai.expect;

describe('devicesProvider', () => {
  let subject;

  it('should returns array of devices', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });

    database.connect()
			.then((db) => {
  subject = DevicesProvider(db);
  subject
					.getDevices(['zara1'])
					.then((res) => {
  res.length.should.be.eq(2);
  done();
})
					.catch(err => done(err));
})
			.catch(err => done(err));
  });
});
