'use strict';

import chai from 'chai';
import sinon from 'sinon';

import { Database } from '../data';
import EventsProvider from './alertsProvider';

chai.should();
const expect = chai.expect;

describe('alertsProvider', () => {
    let subject;

    it('should returns array of alerts', (done) => {
        const database = Database({
            mongo: {
                uri: 'mongodb://iot-user:iot-user-pwd@ds161518.mlab.com:61518/iot-project'
            }
        });
        database.connect()
            .then(db => {
                subject = EventsProvider(db);
                subject
                    .getAlerts(['DevelopmentGateway'])
                    .then(res => {
                        res.length.should.be.eq(2);
                        done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    });



});