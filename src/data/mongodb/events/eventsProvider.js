import { DataProvider } from '../data';

export default function (database) {
  const params = {
    db: database,
    collectionName: 'events',
  };

  const dataProvider = DataProvider(params);

  const EventsProvider = () => ({
    /**
     * Returns all events belonging to the gateways passed as parameter
     */
    getEvents(gateways) {
      return dataProvider.getMany({
        GatewayId: {
          $in: gateways,
        },
      });
    },
  });


  return Object.assign({}, dataProvider, EventsProvider());
}
