'use strict';

import Rx from 'rxjs';
import logger from './common/logger';
import PubNub from 'pubnub';

const pubnubHub = function (config) {
    const pubnub = new PubNub({
        ssl: true,
        logVerbosity: false,
        publishKey: config.publishKey,
        subscribeKey: config.subscribeKey
    });

    logger.log('info', 'starting PubNub');


    return {
        fromChannel: (channel) => {
            return Rx.Observable.create(observer => {
               
                pubnub.addListener({
                    status: function (statusEvent) {
                        logger.debug(`status ${statusEvent}`);
                    },
                    message: function (msg) {
                        logger.log('debug', `Raw message from PubNub ${msg}`);
                        observer.next(msg);
                    },
                    presence: function (presenceEvent) {
                        logger.debug(`presence ${presenceEvent}`);
                    }
                });

                pubnub.subscribe({
                    channels: [channel],
                    withPresence: false
                });

                return function () {
                    console.log("dispose");
                }
            });
        },

        publish: (channel, data) => {
            pubnub.publish({
                channel: channel,
                message: data,
                callback: function (e) {
                    logger.log('debug', `PubNub: published ${data} on ${channel}`);
                },
                error: function (err) {
                    logger.log('error', `PubNub: error publishing ${err}`);
                }
            });
        }
    };
};

export default pubnubHub;