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
    })
      .then(() => subject.getAlerts(['DevelopmentGateway']))
      .then((res) => {
        res.length.should.be.eq(1);
        done();
      })
      .catch(err => done(err));
  });

  it('should returns an empty array', (done) => {
    subject = AlertsProvider(db);
    subject.add({
      gateway: 'DevelopmentGateway',
      date: new Date(),
      deviceId: 'f1-33-d2-25-3b-6c',
      message: 'Lamp could be broken, power is 0 while state is on',
      read: 0,
    })
      .then(() => subject.getAlerts([]))
      .then((res) => {
        res.length.should.be.eq(0);
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
    })
      .then((result) => subject.getAlertById(result.id))
      .then((res) => {
        res.gateway.should.be.eq('SampleGw');
        done();
      })
      .catch(err => done(err));
  });

  it('should return last alert', (done) => {
    const date = new Date();
    subject = AlertsProvider(db);
    subject
      .add({
        gateway: 'SampleGw',
        date: new Date(),
        lastUpdate: date,
        deviceId: 'f1-33-d2-25-3b-6c',
        key: 'akey',
        message: 'Lamp could be broken, power is 0 while state is on',
        read: 0,
      })
      .then(() => {
        date.setHours(date.getHours() + 3);
        return subject.add({
          gateway: 'SampleGw',
          date: new Date(),
          lastUpdate: date,
          deviceId: '00:00:00:00:00:00',
          key: 'akey',
          message: 'Lamp could be broken, power is 0 while state is on',
          read: 0,
        });
      })
      .then(() => subject.getLastAlertByKey('akey'))
      .then((result) => {
        result.deviceId.should.eq('00:00:00:00:00:00');
        done();

      })
      .catch(err => done(err));
  });
});
