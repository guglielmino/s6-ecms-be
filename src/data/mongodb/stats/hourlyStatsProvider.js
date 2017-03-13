import { DataProvider } from '../data';

/**
 * Hourly stats are stored by convention in the event date
 * with time set to the original hour O'clock.
 * For example if event date is 12/03/2017 21:34:23.234Z the stat's date
 * will be  12/03/2017 21:34:00.000Z
 * @param date
 * @returns {Date}
 */
const getRefDateTime = (date) => {
  const dayDate = new Date(date);
  dayDate.setUTCMinutes(0);
  dayDate.setUTCSeconds(0);
  dayDate.setUTCMilliseconds(0);
  return dayDate;
};

const HourlyStatsProvider = ({ db, collectionName }) => {
  db.collection(collectionName, (err, col) => {
    col.createIndex({ date: 1, gateway: 1, deviceId: 1 },
      { unique: true, background: true, dropDups: true, w: 1 },
      (error) => {
        if (error) {
          throw error;
        }
      });
  });

  return {
    updateHourlyStat({ date, gateway, deviceId, power }) {
      const dayDate = getRefDateTime(date);

      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.updateOne(
            { date: dayDate, gateway, deviceId },
            {
              $inc: { power },
            },
            { upsert: true },
            (error, r) => {
              if (error) {
                reject(error);
              } else {
                const resp = JSON.parse(r);
                resolve(resp.ok === 1);
              }
            },
          );
        });
      });
    },

    getHourlyStatByDevice(date, gateway, deviceId) {
      const dayDate = getRefDateTime(date);

      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({
            date: dayDate,
            gateway,
            deviceId,
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

    getHourlyStat(date, gateways) {
      const dayDate = getRefDateTime(date);

      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.aggregate([{
            $match: {
              $and: [
                { gateway: { $in: gateways } },
                { date: { $eq: dayDate } },
              ],
            },
          }, {
            $group: {
              _id: { $hour: '$date' },
              power: {
                $sum: '$power',
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
    collectionName: 'hourlyStats',
  };
  return Object.assign({}, DataProvider(params), HourlyStatsProvider(params));
}
