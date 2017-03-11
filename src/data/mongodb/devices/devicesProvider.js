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
     * Find the device having specified name in power command
     * @param topic
     */
    findByPowerCommand(topicName) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({ 'commands.power': `mqtt:cmnd/${topicName}/POWER` })
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
