import MongoClient from 'mongodb';

const Database = function (config) {
    if (!config.mongo.uri) {
        throw Error("MongoDB connection not configured, missing config.mongo.uri ");
    }

    return {
        connect: function () {
            return new Promise((resolve, reject) => {
                MongoClient.connect(config.mongo.uri, (err, db) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(db);
                });
            });
        }
    }
};


const DataProvider = function ({ db, collectionName }) {

    return {
        add: function (obj) {
            return new Promise((resolve, reject) => {
                db.collection(collectionName, (err, col) => {
                    if (err) {
                        reject(err);
                    }

                    col.insertOne(obj, (err, r) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(r.insertedCount);
                        }
                    });
                });
            });
        }
    }
};

export {
    Database,
    DataProvider
};