import Rx from 'rxjs';
import PubNub from 'pubnub';
import logger from './common/logger';

const pubnubHub = (config) => {
  const pubnub = new PubNub({
    ssl: true,
    logVerbosity: false,
    publishKey: config.publishKey,
    subscribeKey: config.subscribeKey,
  });

  logger.log('info', 'starting PubNub');

  return {
    fromChannel: channel => Rx.Observable.create((observer) => {
      pubnub.addListener({
        status: (statusEvent) => {
          logger.debug(`status ${statusEvent}`);
        },
        message: (msg) => {
          logger.log('debug', `Raw message from PubNub ${msg}`);
          observer.next(msg);
        },
        presence: (presenceEvent) => {
          logger.debug(`presence ${presenceEvent}`);
        },
      });

      pubnub.subscribe({
        channels: [channel],
        withPresence: false,
      });

      return () => {
        logger.log('debug', 'dispose');
      };
    }),

    publish: (channel, data) => {
      pubnub.publish({
        channel,
        message: data,
        callback() {
          logger.log('debug', `PubNub: published ${data} on ${channel}`);
        },
        error(err) {
          logger.log('error', `PubNub: error publishing ${err}`);
        },
      });
    },
  };
};

export default pubnubHub;
