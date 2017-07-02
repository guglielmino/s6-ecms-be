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
import BootstapRuleEngine from './src/bootstrap/ruleEngine';

import emitter from './src/streams/emitter';
import socketServer from './src/socketServer';
import pubnubHub from './src/streams/pubnubHub';

import expSetup from './src/api/express-setup';
import swaggerSetup from './src/api/swagger-setup';
import routes from './src/api/routes';
import api from './src/api';

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

    const ruleEngine = BootstapRuleEngine(providers, pnub, socket);

    Rx.Observable
      .merge(getPNEventObservable(pub$), getEmitterEventObservable(emitter))
      .subscribe(
        (event) => {
          ruleEngine.handle(event);
        },
        error => logger.log('error', error),
      );

    const connection$ = socket.fromEvent('connection');
    connection$
      .subscribe(() => logger.log('info', 'Socket.io connected'));
  })
  .catch(err => logger.log('error', err));
