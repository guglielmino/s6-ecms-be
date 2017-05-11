import { DataProvider, InternalDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'devices',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = InternalDataProvider(params);

  dataProvider.createIndex('deviceId');

  const DevicesProvider = ({ db, collectionName }) => ({

    /**
     * Returns all devices belonging to the gateways passed as parameter
     */
    getDevices(gateways) {
      return queryDataProvider.getMany({
        gateway: {
          $in: gateways,
        },
      });
    },
    getById(entityId) {
      return queryDataProvider.getOne({
        _id: entityId,
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
      const commandKey = `commands.${commandName}`;
      const query = {};
      query[commandKey] = value;

      return queryDataProvider.getOne(query);
    },
    findByDeviceId(deviceId) {
      return queryDataProvider.getOne({ deviceId });
    },
    updateByDeviceId(deviceId, newObj) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.findOneAndUpdate({ deviceId },  // eslint-disable-line no-underscore-dangle
            newObj,
            {
              upsert: true,
              returnOriginal: true,
            },
            (error, r) => {
              if (error) {
                reject(error);
              } else {
                /* eslint-disable no-underscore-dangle, max-len  */
                const respId = r.lastErrorObject.upserted ? r.lastErrorObject.upserted : r.value._id;
                /* eslint-enable no-underscore-dangle, max-len  */
                resolve({ status: r.ok, id: respId });
              }
            });
        });
      });
    },
  });

  return Object.assign({}, dataProvider, DevicesProvider(params));
}
