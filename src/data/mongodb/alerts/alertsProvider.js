import { DataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'alerts',
  };

  const dataProvider = DataProvider(params);

  const AlertsProvider = () => ({

    /**
     * Returns all alerts related to the gateways passed as parameter
     */
    getAlerts(gateways) {
      return dataProvider.getMany({
        gateway: {
          $in: gateways,
        },
      });
    },
  });


  return Object.assign({}, dataProvider, AlertsProvider());
}
