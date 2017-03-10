import chai from 'chai';
import sinon from 'sinon';
import Rx from 'rxjs';

import { EventEmitter } from 'events';
import { getPNEventObservable, getEmitterEventObservable } from './events';

chai.should();
const expect = chai.expect;

describe('event processor', () => {

  context('PubNub event observable', () => {
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
      const res$ = getPNEventObservable(ob$);

      res$.subscribe((res) => {

        res.Payload.DeviceId.should.be.eq('tele/sonoff/TELEMETRY');
        res.Payload.Time.should.be.eq('2017-01-27T08:46:13.723Z');
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
      const res$ = getPNEventObservable(ob$);

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

  context('EventEmitter observable', () => {
    let eventEmitter;

    beforeEach(() => {
      eventEmitter = new EventEmitter();
    });

    it('should map ENERGY event data to payload to be stored', (done) => {
      const sampleEvent = {
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
      };

      getEmitterEventObservable(eventEmitter)
        .subscribe((res) => {
          res.Payload.Current.should.be.eq('8.37');
          res.Payload.Time.should.be.eq('2017-01-27T08:46:13.723Z');
          done();
        });

      eventEmitter.emit('event', sampleEvent);
    });

  });
});
