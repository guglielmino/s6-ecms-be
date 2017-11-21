import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import EventsProvider from './eventsProvider';

chai.should();
const expect = chai.expect;

describe('eventProvider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('events', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should returns array of events', (done) => {
    subject = EventsProvider(db);
    subject
      .add({
        GatewayId: 'VG59',
        Type: 'ENERGY',
        Payload: {
          DeviceId: 'tele/lamp2/TELEMETRY',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 0,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: new Date(),
          created: new Date(),
        },
      })
      .then(res => subject.getEvents(['VG59']))
      .then((res) => {
        res.length.should.be.eq(1);
        done();
      })
      .catch(err => done(err));
  });


  it('should add an object to events', (done) => {

    subject = EventsProvider(db);
    subject
      .add({
        name: 'TestEvent',
      })
      .then((res) => {
        res.inserted.should.be.eq(1);
        done();
      })
      .catch(err => done(err));

  });

  it('should get last event by gateway, type and deviceId', (done) => {
    subject = EventsProvider(db);

    subject
      .add({
        GatewayId: 'VG59',
        Type: 'TEST',
        Payload: {
          DeviceId: 'deviceid1',
          Time: new Date(),
          created: new Date(),
          value: '5',
        },
      })
      .then(() => {
        subject
          .add({
            GatewayId: 'GTW',
            Type: 'TEST1',
            Payload: {
              deviceId: 'deviceid',
              Time: new Date(),
              created: new Date(),
            },
          });
      })
      .then(() => {
        subject
          .add({
            GatewayId: 'VG59',
            Type: 'TEST1',
            Payload: {
              deviceId: 'deviceid1',
              Time: new Date(),
              created: new Date(),
              value: '1',
            },
          });
      })
      .then(() => {
        return subject.getLastEvent('VG59', ['TEST', 'TEST1'], 'deviceid1');
      })
      .then((res) => {
        expect(res.GatewayId).to.equal('VG59');
        expect(res.Type).to.equal('TEST1');
        expect(res.Payload.deviceId).to.equal('deviceid1');
        expect(res.Payload.value).to.equal('1');
        done();
      })
      .catch(err => done(err));
  });

});
