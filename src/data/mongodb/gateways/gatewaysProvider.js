import { DataProvider } from '../data';


const GatewaysProvider = ({ db, collectionName }) => {
  db.collection(collectionName, (err, col) => {
    col.createIndex('code', { unique: true, background: true, dropDups: true, w: 1 }, (error) => {
      if (error) {
        throw error;
      }
    });
  });

  return {

    /**
     * Returns gateways objects having code passed in gateways array
     */
    getGateways(gateways) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.find({
            code: {
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


  };
};

export default function (db) {
  const params = {
    db,
    collectionName: 'gateways',
  };
  return Object.assign({}, DataProvider(params), GatewaysProvider(params));
}
