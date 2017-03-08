import Rx from 'rxjs'; // eslint-disable-line no-unused-vars
import energyMapper from './mappers/energyMapper';
import infoMapper from './mappers/infoMapper';

import {
  EVENT_TYPE_ENERGY,
  EVENT_TYPE_INFO,
  EVENTS_TYPES,
} from '../../../consts';

const eventMapper = events$ => (
  events$
    .map((e) => {
      switch (e.Type) {
        case EVENT_TYPE_ENERGY:
          return energyMapper(e);
        case EVENT_TYPE_INFO:
          return infoMapper(e);
        default:
          throw new Error(`Event unknown ${JSON.stringify(e)}`);
      }
    }));

function getPNEventObservable(pubnub$) {
  const [events$, _] = pubnub$ // eslint-disable-line no-unused-vars
    .map(msg => msg.message)
    .partition(message => message.Type && EVENTS_TYPES.indexOf(message.Type) !== -1);

  return eventMapper(events$);
}

function getEmitterEventObservable(eventEmitter) {
  const events$ = Rx.Observable.fromEvent(eventEmitter, 'event');
  return eventMapper(events$);
}

export {
  getPNEventObservable,
  getEmitterEventObservable,
}; // eslint-disable-line import/prefer-default-export
