import { DataProvider } from '../data';
import ISODate from 'mongodb';

const EventsProvider = function ({
    db,
    collectionName
}) {

    return {

        /**
         * Returns all events belonging to the gateways passed as parameter
         */
        getEvents: function (gateways) {
            return new Promise((resolve, reject) => {
                db.collection(collectionName, (err, col) => {
                    if (err) {
                        reject(err);
                    }

                    col.find({
                            GatewayId: {
                                $in: gateways
                            }
                        })
                        .toArray((err, docs) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(docs);
                            }
                        });
                });
            });
        },

        /**
         * Returns stats about energy consuption for one o more gateway in a specified date
         */
        getEnergyStats: function (gateways, date) {
            const startOfTheDay = new Date(date.getTime());
            startOfTheDay.setHours(0);
            startOfTheDay.setMinutes(0);
            startOfTheDay.setSeconds(0);

            const endOfTheDay = new Date(date.getTime());
            endOfTheDay.setHours(23);
            endOfTheDay.setMinutes(59);
            endOfTheDay.setSeconds(59);

            return new Promise((resolve, reject) => {
                db.collection(collectionName, (err, col) => {
                    if (err) {
                        reject(err);
                    }

                    col.aggregate([{
                        $match: {
                            $and: [{
                                    GatewayId: {
                                        $in: gateways
                                    }
                                },
                                {
                                    "Payload.Time": {
                                        $gte: startOfTheDay,
                                        $lte: endOfTheDay
                                    }
                                }
                            ]
                        }

                    }, {
                        $group: {
                            _id: null,
                            Current: {
                                $sum: "$Payload.Current"
                            },
                            Power: {
                                $sum: "$Payload.Factor"
                            }
                        }
                    }]).toArray((err, docs) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(docs);
                        }
                    });
                });
            });
        }

    }
}

export default function (db) {
    const params = {
        db,
        collectionName: 'events'
    };
    return Object.assign({}, DataProvider(params), EventsProvider(params));
}