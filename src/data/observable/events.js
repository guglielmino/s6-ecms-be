import Rx from 'rxjs'; // eslint-disable-line no-unused-vars
import { EVENTS_TYPES } from '../../../consts';

function getPNEventObservable(pubnub$) {
  // From PubNub are allower only messages coming from gateway (having Type)
  const [events$, _] = pubnub$ // eslint-disable-line no-unused-vars
    .map(msg => msg.message)
    .partition(message => message.Type && EVENTS_TYPES.indexOf(message.Type) !== -1);

  return events$;
}

function getEmitterEventObservable(eventEmitter) {
  const events$ = Rx.Observable.fromEvent(eventEmitter, 'event');
  return events$;
}

export {
  getPNEventObservable,
  getEmitterEventObservable,
}; // eslint-disable-line import/prefer-default-export
