import { DataProvider, InternalDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'gateways',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = InternalDataProvider(params);

  dataProvider.createIndex('code');

  const GatewaysProvider = ({ db, collectionName }) => ({

    /**
     * Returns gateways objects having code passed in gateways array
     */
    getGateways(gateways) {
      return queryDataProvider.getMany({
        code: {
          $in: gateways,
        },
      });
    },

    getGateway(gatewayCode) {
      return queryDataProvider.getOne({ code: gatewayCode });
    },

    updateByGatewayCode(gatewayCode, newObj) {
      return new Promise((resolve, reject) => {
        db.collection(collectionName, (err, col) => {
          if (err) {
            reject(err);
          }

          col.findOneAndUpdate({ code: gatewayCode },  // eslint-disable-line no-underscore-dangle
            newObj,
            {
              upsert: true,
              returnOriginal: false,
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

  return Object.assign({}, dataProvider, GatewaysProvider(params));
}
