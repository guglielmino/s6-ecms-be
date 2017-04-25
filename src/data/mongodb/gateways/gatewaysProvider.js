import { DataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'gateways',
  };

  const dataProvider = DataProvider(params);

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
        return dataProvider.getMany({
          code: {
            $in: gateways,
          },
        });
      },
    };
  };
  return Object.assign({}, dataProvider, GatewaysProvider(params));
}
