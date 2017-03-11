import Rx from 'rxjs';
import config from './src/config';
import * as consts from './consts';
import logger from './src/common/logger';
import {
  getPNEventObservable,
  getEmitterEventObservable,
} from './src/data/observable/events';

import { Database } from './src/data/mongodb/data';
import bootstrapDataProvider from './src/bootstrap/dataProviders';

import emitter from './src/emitter';
import socketServer from './src/socketServer';
import pubnubHub from './src/pubnubHub';

import expSetup from './src/api/express-setup';
import swaggerSetup from './src/api/swagger-setup';
import routes from './src/api/routes';
import api from './src/api';

import infoMapper from './src/data/observable/mappers/infoMapper';
import energyMapper from './src/data/observable/mappers/energyMapper';
import powerMapper from './src/data/observable/mappers/powerMapper';
import EventsProcessor from './src/events/eventProcessor';
import MessageMediator from './src/messageMediator';

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
    messageMediator.addHandler(msg => msg.Type === consts.EVENT_TYPE_ENERGY,
      msg => eventsProcessor.processEnergyEvent(energyMapper(msg)));
    messageMediator.addHandler(msg => msg.Type === consts.EVENT_TYPE_INFO,
      msg => eventsProcessor.processInfoEvent(infoMapper(msg)));
    messageMediator.addHandler(msg => msg.type === consts.APPEVENT_TYPE_POWER,
      msg => logger.log('info', msg));
    messageMediator.addHandler(msg => msg.Type === consts.EVENT_POWER_STATUS,
      msg => eventsProcessor.processPowerStatus(powerMapper(msg)));

    Rx.Observable
      .merge(getPNEventObservable(pub$), getEmitterEventObservable(emitter))
      .subscribe(
        (event) => {
          messageMediator.process(event);
        },
        error => logger.log('error', error),
      );

    const connection$ = socket.fromEvent('connection');
    connection$
      .subscribe(conn => `Connection ${conn}`);
  })
  .catch(err => logger.log('error', err));
