import { DataProvider } from '../data';

const StatsProvider = ({ db, collectionName }) => {
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
      const dayDate = new Date(date.getTime());
      dayDate.setHours(0);
      dayDate.setMinutes(0);
      dayDate.setSeconds(0);
      dayDate.setMilliseconds(0);

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

  };
};

export default function (db) {
  const params = {
    db,
    collectionName: 'stats',
  };
  return Object.assign({}, DataProvider(params), StatsProvider(params));
}
