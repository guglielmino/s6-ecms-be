import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import AlertsProvider from './alertsProvider';

chai.should();
const expect = chai.expect;

describe('alertsProvider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('alerts', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should returns array of alerts', (done) => {
    subject = AlertsProvider(db);
    subject.add({
      gateway: 'DevelopmentGateway',
      date: new Date(),
      deviceId: 'f1-33-d2-25-3b-6c',
      message: 'Lamp could be broken, power is 0 while state is on',
      read: 0,
      _id: '58ccfe591f1628f9e3cdd903',
    })
      .then(res => subject.getAlerts(['DevelopmentGateway']))
      .then((res) => {
        res.length.should.be.eq(1);
        done();
      })
      .catch(err => done(err));
  });

  it('should get a single alert', (done) => {
    subject = AlertsProvider(db);
    subject.add({
      gateway: 'SampleGw',
      date: new Date(),
      deviceId: 'f1-33-d2-25-3b-6c',
      message: 'Lamp could be broken, power is 0 while state is on',
      read: 0,
      _id: '58c400990f980e232ecc6fb6',
    })
      .then(res => subject.getAlertById('58c400990f980e232ecc6fb6'))
      .then((res) => {
        res.gateway.should.be.eq('SampleGw');
        done();
      })
      .catch(err => done(err));

  });
});
