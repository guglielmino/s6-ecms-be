'use strict';

import Rx from 'rxjs';
import config from './src/config';
import * as consts from './consts';
import {getEventObservable} from './src/data/observable/events';

import {Database} from './src/data/mongodb/data';
import  { EventsProvider,
	GatewaysProvider,
	DevicesProvider,
	AlertsProdiver
} from './src/data/mongodb/';


import socketServer from './src/socketServer';
import pubnubHub from './src/pubnubHub';
import api from './src/api';

import MessageMediator from './src/messageMediator';

const database = Database(config);
database.connect()
	.then(db => {
		const pnub = pubnubHub(config.pubnub);

		const providers = bootstrapDataProvider(db);

		const expressServer = api(config, providers);

		const socket = socketServer(expressServer);
		const pub$ = pnub.fromChannel(consts.PUBNUB_EVENTS_CHANNEL);

		const messageMediator = MessageMediator();
		messageMediator.addHandler(consts.EVENT_TYPE_ENERGY, providers.eventProvider.add);
		messageMediator.addHandler(consts.EVENT_TYPE_INFO, ({Payload}) => { providers.deviceProvider.add(Payload) });

		getEventObservable(pub$)
			.subscribe((event) => {
				const processor = messageMediator.process(event);
				if(processor) {
					processor(event);
				}
			});

		const connection$ = socket.fromEvent('connection');
		connection$
			.subscribe(conn => `Connection ${conn}`);
	})
	.catch(err => console.log(err));



function bootstrapDataProvider(db) {
	return {
		eventProvider: EventsProvider(db),
		gatewayProvider: GatewaysProvider(db),
		deviceProvider: DevicesProvider(db),
		alertProvider: AlertsProdiver(db)
	}
}