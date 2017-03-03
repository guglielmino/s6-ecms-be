

import chai from 'chai';
import sinon from 'sinon';
import Rx from 'rxjs';

import { getEventObservable } from './events';

chai.should();
const expect = chai.expect;

describe('event processor', () => {
  it('should map ENERGY event data to payload to be stored', (done) => {
    const rawPayloads = [{
      channel: 'events',
      actualChannel: null,
      subscribedChannel: 'events',
      timetoken: '14855067742394598',
      publisher: '29bd9e3c-039e-4bc1-ba7d-ec64cecd7860',
      message: {
        GatewayId: 'DevelopmentGateway',
        Type: 'ENERGY',
        Payload: {
          DeviceId: 'tele/sonoff/TELEMETRY',
          Yesterday: '57.67',
          Today: '249.37',
          Period: 1,
          Power: 10,
          Factor: '0.00',
          Voltage: 220,
          Current: '8.37',
          Time: '2017-01-27T08:46:13.723Z',
        },
      },
    }];

    const ob$ = Rx.Observable.from(rawPayloads);
    const res$ = getEventObservable(ob$);

    res$.subscribe((res) => {
      res.Payload.Current.should.be.eq(8.37);
      res.Payload.Time.should.be.a('Date');
      done();
    });
  });


  it('should emit nothing if the event is unknown', (done) => {
    const rawPayloads = [{
      channel: 'events',
      actualChannel: null,
      subscribedChannel: 'events',
      timetoken: '14855067742394598',
      publisher: '29bd9e3c-039e-4bc1-ba7d-ec64cecd7860',
      message: {
        GatewayId: 'DevelopmentGateway',
        Type: 'AN_EVENT',
        Payload: {},
      },
    }];

    const ob$ = Rx.Observable.from(rawPayloads);
    const res$ = getEventObservable(ob$);

    res$.subscribe(
            (x) => {
              done(new Error('Should not emitted'));
            },
            (err) => {
              done(err);
            },
            () => {
              done();
            });
  });
});
