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

export default function (database) {
  const params = {
    db: database,
    collectionName: 'hourlyStats',
  };

  const dataProvider = DataProvider(params);
  dataProvider.createIndex({ date: 1, gateway: 1, deviceId: 1 });

  const HourlyStatsProvider = ({ db, collectionName }) => ({
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
              $set: { power },
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
      return dataProvider.getMany({
        date: dayDate,
        gateway,
        deviceId,
      });
    },

    getHourlyStat(dates, gateways, groupFields) {
      const dayDates = dates.map(d => getRefDateTime(d));

      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          let grouping = [];

          if (groupFields) {
            if (!Array.isArray(groupFields)) {
              reject('Group field must be an array');
            }
            grouping = groupFields.map(field => ({ [field]: `$${field}` }));
          }

          col.aggregate([{
            $match: {
              $and: [
                { gateway: { $in: gateways } },
                { date: { $in: dayDates } },
              ],
            },
          }, {
            $group: {
              _id: Object.assign({}, { hour: { $hour: '$date' } }, ...grouping),
              power: {
                $sum: '$power',
              },
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

  return Object.assign({}, dataProvider, HourlyStatsProvider(params));
}
