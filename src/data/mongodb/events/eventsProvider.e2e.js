import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import EventsProvider from './eventsProvider';

chai.should();
const expect = chai.expect;

describe('eventsProvider', () => {
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

});
