import { ObjectId } from 'mongodb';
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
    getAlertById(alertId) {
      let _id = alertId; // eslint-disable-line no-underscore-dangle
      if (typeof id === 'string' || alertId instanceof String) {
        _id = ObjectId(alertId);
      }

      return dataProvider.getOne({ _id });
    },
  });


  return Object.assign({}, dataProvider, AlertsProvider());
}
