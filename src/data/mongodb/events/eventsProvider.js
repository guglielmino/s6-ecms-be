import { DataProvider } from '../data';

const EventsProvider = ({ db, collectionName }) => {
  /**
   * Return the filter used in MongoDB query for handling events of a specific day
   */
  function getDayFilter(fieldName, date) {
    const startOfTheDay = new Date(date.getTime());
    startOfTheDay.setHours(0);
    startOfTheDay.setMinutes(0);
    startOfTheDay.setSeconds(0);

    const endOfTheDay = new Date(date.getTime());
    endOfTheDay.setHours(23);
    endOfTheDay.setMinutes(59);
    endOfTheDay.setSeconds(59);

    const ret = {};
    ret[fieldName] = {
      $gte: startOfTheDay,
      $lte: endOfTheDay,
    };

    return ret;
  }

  return {

    /**
     * Returns all events belonging to the gateways passed as parameter
     */
    getEvents(gateways) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({
            GatewayId: {
              $in: gateways,
            },
          })
            .toArray((error, docs) => {
              if (error) {
                reject(error);
              } else {
                resolve(docs);
              }
            });
        });
      });
    },

    /**
     * Returns stats about energy consumption for one o more gateway in a specified date
     */
    getEnergyStats(gateways, date, hourly) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.aggregate([{
            $match: {
              $and: [{
                GatewayId: {
                  $in: gateways,
                },
              },
                getDayFilter('Payload.Time', date),
              ],
            },

          }, {
            $group: {
              _id: hourly ? { $hour: '$Payload.Time' } : null,
              Current: {
                $sum: '$Payload.Current',
              },
              Power: {
                $sum: '$Payload.Factor',
              },
            },
          }]).toArray((error, docs) => {
            if (error) {
              reject(error);
            } else {
              resolve(docs);
            }
          });
        });
      });
    },

    getEnergyStatsByHours(gateways, date) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.aggregate([
            {
              $match: {
                $and: [{
                  GatewayId: {
                    $in: gateways,
                  },
                },
                  getDayFilter('Payload.Time', date),
                ],
              },

            },
            {
              $group: {
                _id: { $hour: '$Payload.Time' },
                Current: {
                  $sum: '$Payload.Current',
                },
                Power: {
                  $sum: '$Payload.Factor',
                },
              },
            }])
            .toArray((error, docs) => {
              if (error) {
                reject(error);
              } else {
                resolve(docs);
              }
            });
        });
      });
    },
  };
};

export default function (db) {
  const params = {
    db,
    collectionName: 'events',
  };
  return Object.assign({}, DataProvider(params), EventsProvider(params));
}
