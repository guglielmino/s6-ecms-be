import { DataProvider } from '../data';

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
    collectionName: 'deviceValues',
  };

  const dataProvider = DataProvider(params);

  dataProvider.createIndex({ date: 1, gateway: 1, deviceId: 1, type: 1 });

  const DeviceValuesProvider = ({ db, collectionName }) => ({
    updateDeviceValues({ date, gateway, deviceId, type, value, unit }) {
      const dayDate = getRefDateTime(date);
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.updateOne(
            { date: dayDate, gateway, deviceId, type, unit },
            {
              $set: { value },
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

    getDeviceValues(date, deviceId) {
      const dayDate = getRefDateTime(date);
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }
          col.aggregate([{
            $match: {
              $and: [
                { date: { $eq: dayDate } },
                { deviceId: { $eq: deviceId } },
              ],
            },
          }, {
            $group: {
              _id: { date: '$date', type: '$type', deviceId: '$deviceId' },
              value: {
                $sum: '$value',
              },
              unit: {
                $max: '$unit',
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

  return Object.assign({}, dataProvider, DeviceValuesProvider(params));
}
