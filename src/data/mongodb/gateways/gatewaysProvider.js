import { DataProvider } from '../data';


const GatewaysProvider = function ({
	db,
	collectionName
}) {

	db.collection(collectionName, (err, col) => {
		col.createIndex('code', { unique: true, background: true, dropDups: true, w: 1 }, (err, ids) => {
			if(err) {
				throw err;
			}
		});
	});

	return {

		/**
		 * Returns gateways objects having code passed in gateways array
		 */
		getGateways: function (gateways) {
			return new Promise((resolve, reject) => {
				db.collection(collectionName, (err, col) => {
					if (err) {
						reject(err);
					}

						col.find({
						code: {
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
		collectionName: 'gateways'
	};
	return Object.assign({}, DataProvider(params), GatewaysProvider(params));
}
