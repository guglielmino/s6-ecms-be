import { DataProvider } from '../data';

/**
 * Daily stats are stored by convention with the event's date
 * and the time set to 00:00:00:000. This function normalize the
 * passed date to the reference one
 * @param date
 */
const getRefDate = (date) => {
  const dayDate = new Date(date.getTime());
  dayDate.setUTCHours(0);
  dayDate.setUTCMinutes(0);
  dayDate.setUTCSeconds(0);
  dayDate.setUTCMilliseconds(0);
  return dayDate;
};


const DailyStatsProvider = ({ db, collectionName }) => {
  db.collection(collectionName, (err, col) => {
    col.createIndex({ date: 1, gateway: 1 },
      { unique: true, background: true, dropDups: true, w: 1 },
      (error) => {
        if (error) {
          throw error;
        }
      });
  });

  return {
    updateDailyStat({ date, gateway, today }) {
      const dayDate = getRefDate(date);

      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.updateOne(
            { date: dayDate, gateway },
            {
              $inc: { today },
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
      const dayDate = getRefDate(date);

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
              _id: '$date',
              today: {
                $sum: '$today',
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
    collectionName: 'dailyStats',
  };
  return Object.assign({}, DataProvider(params), DailyStatsProvider(params));
}
