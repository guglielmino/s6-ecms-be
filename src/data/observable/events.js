import Rx from 'rxjs'; // eslint-disable-line no-unused-vars
import energyMapper from './mappers/energyMapper';
import infoMapper from './mappers/infoMapper';

import {
    EVENT_TYPE_ENERGY,
    EVENT_TYPE_INFO,
    EVENTS_TYPES,
} from '../../../consts';


function getEventObservable(pubnub$) {
  const [events$, _] = pubnub$ // eslint-disable-line no-unused-vars
        .map(msg => msg.message)
        .partition(message => message.Type && EVENTS_TYPES.indexOf(message.Type) !== -1);

  return events$
        .map((e) => {
          switch (e.Type) {
            case EVENT_TYPE_ENERGY:
              return energyMapper(e);
            case EVENT_TYPE_INFO:
              return infoMapper(e);
            default:
              throw new Error(`Event unknown ${e.Type}`);
          }
        });
}


export { getEventObservable }; // eslint-disable-line import/prefer-default-export
