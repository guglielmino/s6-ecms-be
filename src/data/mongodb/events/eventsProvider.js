import { DataProvider } from '../data';

const EventsProvider = ({ db, collectionName }) => ({
  /**
   * Returns all events belonging to the gateways passed as parameter
   */
  getEvents(gateways) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, (err, col) => {
        if (err) {
          reject(err);
        }

        col.find({
          GatewayId: {
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
    collectionName: 'events',
  };
  return Object.assign({}, DataProvider(params), EventsProvider(params));
}
