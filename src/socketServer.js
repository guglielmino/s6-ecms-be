

import Rx from 'rxjs';
import Server from 'socket.io';

const socketServer = (server) => {
  const io = Server.listen(server);

  return {
    dispose: io.close,
    fromEvent: eventName => Rx.Observable.create((observer) => {
      io.on(eventName, (data) => {
        observer.next(data);
      });
    }),
  };
};

export default socketServer;
