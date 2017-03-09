import { DataProvider } from '../data';

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
      const dayDate = new Date(date.getTime());
      dayDate.setMinutes(0);
      dayDate.setSeconds(0);
      dayDate.setMilliseconds(0);

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

  };
};

export default function (db) {
  const params = {
    db,
    collectionName: 'hourlyStats',
  };
  return Object.assign({}, DataProvider(params), HourlyStatsProvider(params));
}
