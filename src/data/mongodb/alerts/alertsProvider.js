import { DataProvider } from '../data';

const AlertsProvider = ({ db, collectionName }) => ({

  /**
   * Returns all alerts related to the gateways passed as parameter
   */
  getAlerts(gateways) {
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
});


export default function (db) {
  const params = {
    db,
    collectionName: 'alerts',
  };
  return Object.assign({}, DataProvider(params), AlertsProvider(params));
}
