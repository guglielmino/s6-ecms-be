import { DataProvider, QueryDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'gateways',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = QueryDataProvider(params);

  dataProvider.createIndex('code');

  const GatewaysProvider = () => ({

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
  });

  return Object.assign({}, dataProvider, GatewaysProvider());
}
