import Rx from 'rxjs';
import ISODate from 'mongodb';

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
                    return translateEnergyPayload(e);
            }

            throw new Error(`Event unknow ${e.Type}`);
        });
}

function translateEnergyPayload(e) { 
    return { ...e,
        Payload: {
            ...e.Payload,
            Current: parseFloat(e.Payload.Current),
            Yesterday: parseFloat(e.Payload.Yesterday),
            Today: parseFloat(e.Payload.Today),
            Factor: parseFloat(e.Payload.Factor),
            Time: new Date(e.Payload.Time)
        }
    };
}

export  {
    getEventObservable
}