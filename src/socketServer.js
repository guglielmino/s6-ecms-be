import Rx from 'rxjs';
import Server from 'socket.io';
import socketioJwt from 'socketio-jwt';

import config from './config';

const socketServer = (server) => {
  const io = Server.listen(server);

  io.on('connection', socketioJwt.authorize({
    secret: config.auth0.secret,
    timeout: 15000 // 15 seconds to send the authentication message
  }))
    .on('authenticated', (socket) => {
      const user = socket.decoded_token;

      // Each user gateway is used as room name and subscribed.
      socket.decoded_token.app_metadata.gateways.forEach(gateway => {
        socket.join(gateway);
      });
    });


  return {
    dispose: io.close,
    fromEvent: eventName => Rx.Observable.create((observer) => {
      io.on(eventName, (data) => {
        observer.next(data);
      });
    }),
    emit: (event, payload) => io.emit(event, payload),
  };
};

export default socketServer;
