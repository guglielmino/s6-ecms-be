import Rx from 'rxjs';
import Server from 'socket.io';
import socketioJwt from 'socketio-jwt';
import logger from './common/logger';
import config from './config';

const socketServer = (server) => {
  const io = Server.listen(server);

  io.on('connection', socketioJwt.authorize({
    secret: config.auth0.secret,
    timeout: config.auth0.timeout,
  }))
    .on('authenticated', (socket) => {
      const user = socket.decoded_token;

      // Each user gateway is used as room name and subscribed.
      const appMetadata = user['https://ecms.smartsix.it/app_metadata'];
      appMetadata.gateways
        .forEach((gateway) => {
          socket.join(gateway, err => (err ? logger.log('error', err) : null));
        });
    });


  return {
    dispose: io.close,
    fromEvent: eventName => Rx.Observable.create((observer) => {
      io.on(eventName, (data) => {
        observer.next(data);
      });
    }),
    emit: (gateway, event, payload) => io.to(gateway).emit(event, payload),
  };
};

export default socketServer;
