import Rx from 'rxjs';
import ISODate from 'mongodb';
import energyMapper from './mappers/energyMapper';
import infoMapper from './mappers/infoMapper';

import { 
    EVENT_TYPE_ENERGY,
    EVENT_TYPE_INFO,
    EVENTS_TYPES
} from '../../../consts';


function getEventObservable(pubnub$) {
    const [events$, _] = pubnub$
        .map(msg => msg.message)
        .partition(message => message.Type &&  EVENTS_TYPES.indexOf(message.Type) != -1);

    return events$
        .map(e => {
            switch (e.Type) {
                case EVENT_TYPE_ENERGY:
                    return energyMapper(e);
                case EVENT_TYPE_INFO:
                    return infoMapper(e);
            }

            throw new Error(`Event unknown ${e.Type}`);
        });
}


export  {
    getEventObservable
}