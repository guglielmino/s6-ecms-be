import { DataProvider } from '../data';

const DevicesProvider = ({ db, collectionName }) => {
  db.collection(collectionName, (err, col) => {
    col.createIndex('deviceId', { unique: true, background: true, dropDups: true, w: 1 },
      (error) => {
        if (error) {
          throw error;
        }
      });
  });

  return {

    /**
     * Returns all devices belonging to the gateways passed as parameter
     */
    getDevices(gateways) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({
            gateway: {
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
     * Find a device having specified command and value
     * eg. passing 'power' and 'mqtt:cmnd/lamp' means "get the device having
     * "commands.power" equal to "mqtt:cmnd/lamp"
     * @param commandName
     * @param value
     * @returns {Promise}
     */
    findByCommand(commandName, value) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          const commandKey = `commands.${commandName}`;
          const query = { };
          query[commandKey] = value;

          col.find(query)
            .toArray((error, docs) => {
              if (error) {
                reject(error);
              } else {
                resolve(docs[0]);
              }
            });
        });
      });
    },
    findByDeviceId(deviceId) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({ deviceId })
            .toArray((error, docs) => {
              if (error) {
                reject(error);
              } else {
                resolve(docs[0]);
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
    collectionName: 'devices',
  };
  return Object.assign({}, DataProvider(params), DevicesProvider(params));
}
