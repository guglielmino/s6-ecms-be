import { DataProvider, InternalDataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'events',
  };

  const dataProvider = DataProvider(params);
  const queryDataProvider = InternalDataProvider(params);

  const EventsProvider = () => ({
    /**
     * Returns all events belonging to the gateways passed as parameter
     */
    getEvents(gateways) {
      return queryDataProvider.getMany({
        GatewayId: {
          $in: gateways,
        },
      });
    },

    getLastEvent(gateway, types, deviceId) {
      return queryDataProvider.getMany({
        GatewayId: gateway,
        Type: {
          $in: types,
        },
        'Payload.deviceId': deviceId,
      });
    },
  });


  return Object.assign({}, dataProvider, EventsProvider());
}
