import Rx from 'rxjs';
import config from './src/config';
import * as consts from './consts';
import logger from './src/common/logger';
import {
  getPNEventObservable,
  getEmitterEventObservable,
} from './src/data/observable/events';

import { Database } from './src/data/mongodb/data';
import {
  EventsProvider,
  GatewaysProvider,
  DevicesProvider,
  AlertsProdiver,
  DailyStatsProvider,
  HourlyStatsProvider,
} from './src/data/mongodb/';

import emitter from './src/emitter';
import socketServer from './src/socketServer';
import pubnubHub from './src/pubnubHub';

import expSetup from './src/api/express-setup';
import swaggerSetup from './src/api/swagger-setup';
import routes from './src/api/routes';
import api from './src/api';

import EventsProcessor from './src/events/eventProcessor';
import MessageMediator from './src/messageMediator';

function bootstrapDataProvider(db) {
  return {
    eventProvider: EventsProvider(db),
    gatewayProvider: GatewaysProvider(db),
    deviceProvider: DevicesProvider(db),
    alertProvider: AlertsProdiver(db),
    dailyStatsProvider: DailyStatsProvider(db),
    hourlyStatsProvider: HourlyStatsProvider(db),
  };
}

const database = Database(config);
database.connect()
  .then((db) => {
    const pnub = pubnubHub(config.pubnub);

    const providers = bootstrapDataProvider(db);

    const app = expSetup();
    swaggerSetup(app);
    routes(app, providers);
    const expressServer = api(config, app);

    const socket = socketServer(expressServer);

    const pub$ = pnub.fromChannel(consts.PUBNUB_EVENTS_CHANNEL);

    const eventsProcessor = EventsProcessor(providers);

    const messageMediator = MessageMediator();
    messageMediator.addHandler(consts.EVENT_TYPE_ENERGY, eventsProcessor.processEnergyEvent);
    messageMediator.addHandler(consts.EVENT_TYPE_INFO, eventsProcessor.processInfoEvent);

    Rx.Observable
      .merge(getPNEventObservable(pub$), getEmitterEventObservable(emitter))
      .subscribe(
        (event) => {
          const processor = messageMediator.process(event);
        },
        error => logger.log('error', error),
      );

    const connection$ = socket.fromEvent('connection');
    connection$
      .subscribe(conn => `Connection ${conn}`);
  })
  .catch(err => logger.log('error', err));
