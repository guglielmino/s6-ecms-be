import { ObjectId } from 'mongodb';
import { DataProvider, InternalDataProvider } from '../data';

const getQueryFromSearch = (search) => {
  const { gateways, text, read } = search;
  const query = {
    gateway: {
      $in: gateways,
    },
    ...(text ? { $text: { $search: text } } : null),
    ...(read ? { read } : null),
  };
  return query;
};

export default function (database) {
  const params = {
    db: database,
    collectionName: 'alerts',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = InternalDataProvider(params);

  dataProvider.createTextIndex('message');

  const AlertsProvider = () => ({

    /**
     * Returns all alerts related to the gateways passed as parameter
     */
    getAlerts(gateways) {
      return this.getPagedAlerts({ gateways }, { pageSize: 0 });
    },
    getPagedAlerts(search, pagination) {
      const alertList = {};
      const { pageSize, lastObjectId } = pagination;
      const query = getQueryFromSearch(search);
      return queryDataProvider
          .getMany({
            ...query,
            ...(lastObjectId ? {
              _id: {
                $lt: ObjectId(lastObjectId),
              },
            } : null),
          }, pageSize)
          .then((result) => {
            const lastId = result.length > 0 ?
              result[result.length - 1]._id : 0;// eslint-disable-line no-underscore-dangle
            alertList.list = result;
            alertList.lastId = lastId;
            return queryDataProvider.count({
              ...query,
              _id: {
                $lt: lastId,
              },
            });
          })
          .then((result) => {
            alertList.hasNext = result > 0;
            return queryDataProvider.count({
              ...query,
            });
          })
          .then((result) => {
            alertList.totalElements = result;
            return Promise.resolve(alertList);
          })
          .catch(err => Promise.reject(err));
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
