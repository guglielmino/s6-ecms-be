import { DataProvider } from '../data';
import ISODate from 'mongodb';

const DevicesProvider = function ({
	db,
	collectionName
}) {

	db.collection(collectionName, (err, col) => {
		col.createIndex('deviceId', { unique: true, background: true, dropDups: true, w: 1 }, (err, ids) => {
			if(err) {
				throw err;
			}
		});
	});

	return {

		/**
		 * Returns all devices belonging to the gateways passed as parameter
		 */
		getDevices: function (gateways) {
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
		},
	}
}

export default function (db) {
	const params = {
		db,
		collectionName: 'devices'
	};
	return Object.assign({}, DataProvider(params), DevicesProvider(params));
}