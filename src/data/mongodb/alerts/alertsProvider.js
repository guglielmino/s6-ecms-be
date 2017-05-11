import { ObjectId } from 'mongodb';
import { DataProvider, InternalDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'alerts',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = InternalDataProvider(params);

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
    deleteById(alertId) {
      let _id = alertId; // eslint-disable-line no-underscore-dangle
      if (typeof alertId === 'string' || alertId instanceof String) {
        _id = ObjectId(alertId);
      }

      return queryDataProvider.deleteOne({ _id });
    },

    getLastAlertByKey(alertKey) {
      return queryDataProvider.aggregate(
        [
          { $sort: { lastUpdate: -1 } },
          { $match: { key: alertKey } },
          { $limit: 1 },
        ])
        .then((results) => {
          let alert = null;
          if (results && results.length === 1) {
            alert = results[0];
          }
          return Promise.resolve(alert);
        });
    },
  });


  return Object.assign({}, dataProvider, AlertsProvider());
}
