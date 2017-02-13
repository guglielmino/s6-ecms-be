import { DataProvider } from '../data';
import ISODate from 'mongodb';

const AlertsProvider = function ({
    db,
    collectionName
}) {

	return {

		/**
		 * Returns all alerts related to the gateways passed as parameter
		 */
		getAlerts: function (gateways) {
			return new Promise((resolve, reject) => {
				db.collection(collectionName, (err, col) => {
					if (err) {
						reject(err);
					}

					col.find({
						gateway: {
							$in: gateways
						}
					})
						.toArray((err, docs) => {
							if (err) {
								reject(err);
							} else {
								resolve(docs);
							}
						});
				});
			});
		}

	}
}


export default function (db) {
    const params = {
        db,
        collectionName: 'alerts'
    };
    return Object.assign({}, DataProvider(params), AlertsProvider(params));
}