import { DataProvider } from '../data';

/**
 * Daily stats are stored by convention with the event's date
 * and the time set to 00:00:00:000. This function normalize the
 * passed date to the reference one
 * @param date
 */
const getRefDate = (date) => {
  const dayDate = new Date(date);
  dayDate.setUTCHours(0);
  dayDate.setUTCMinutes(0);
  dayDate.setUTCSeconds(0);
  dayDate.setUTCMilliseconds(0);
  return dayDate;
};

/* If date is an array of dates create the query to  */
const getQueryDate = (date) => {
  let query = {};
  if (Array.isArray(date)) {
    query = {
      date: {
        $gte: getRefDate(date[0]),
        $lte: getRefDate(date[1]),
      },
    };
  } else {
    query = { date: { $eq: getRefDate(date) } };
  }
  return query;
};

export default function (database) {
  const params = {
    db: database,
    collectionName: 'dailyStats',
  };

  const dataProvider = DataProvider(params);
  dataProvider.createIndex({ date: 1, gateway: 1, deviceId: 1 });

  const DailyStatsProvider = ({ db, collectionName }) => ({
    updateDailyStat({ date, gateway, deviceId, today }) {
      const dayDate = getRefDate(date);


      return new Promise((resolve, reject) => {
        if (!deviceId) reject('DeviceId is mandatory');
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.updateOne(
            { date: dayDate, gateway, deviceId },
            {
              $set: { today },
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

    getDailyStat(date, gateways) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }
          col.aggregate([{
            $match: {
              $and: [
                { gateway: { $in: gateways } },
                getQueryDate(date),
              ],
            },
          }, {
            $group: {
              _id: '$date',
              today: { $sum: '$today' },
            },
          },
          ])
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
  });

  return Object.assign({}, dataProvider, DailyStatsProvider(params));
}
