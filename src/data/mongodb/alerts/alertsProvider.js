import { ObjectId } from 'mongodb';
import { DataProvider, QueryDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'alerts',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = QueryDataProvider(params);

  const AlertsProvider = () => ({

    /**
     * Returns all alerts related to the gateways passed as parameter
     */
    getAlerts(gateways) {
      return queryDataProvider.getMany({
        gateway: {
          $in: gateways,
        },
      });
    },
    getAlertById(alertId) {
      let _id = alertId; // eslint-disable-line no-underscore-dangle
      if (typeof alertId === 'string' || alertId instanceof String) {
        _id = ObjectId(alertId);
      }

      return queryDataProvider.getOne({ _id });
    },
  });


  return Object.assign({}, dataProvider, AlertsProvider());
}
