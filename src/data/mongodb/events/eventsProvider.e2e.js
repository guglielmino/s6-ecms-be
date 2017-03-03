

import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import EventsProvider from './eventsProvider';

chai.should();
const expect = chai.expect;

describe('eventsProvider', () => {
  let subject;

  it('should returns array of events', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });
    database.connect()
            .then((db) => {
              subject = EventsProvider(db);
              subject
                    .getEvents(['DevelopmentGateway'])
                    .then((res) => {
                      res.length.should.be.eq(4);
                      done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
  });

  it('should add an object to events', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });
    database.connect()
            .then((db) => {
              subject = EventsProvider(db);
              subject
                    .add({
                      name: 'TestEvent',
                    })
                    .then((res) => {
                      res.should.be.eq(1);
                      done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
  });

  it('should get stats about a list of gateways', (done) => {
    const database = Database({
      mongo: {
        uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project',
      },
    });
    database.connect()
            .then((db) => {
              subject = EventsProvider(db);
              subject
                    .getEnergyStats(['DevelopmentGateway'], new Date('2017-01-27T14:51:13.738Z'))
                    .then((res) => {
                      res.length.should.be.eq(1);
                      done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
  });
});
