import MongoClient from 'mongodb';

const Database = (config) => {
  if (!config.mongo.uri) {
    throw Error('MongoDB connection not configured, missing config.mongo.uri ');
  }

  return {
    connect() {
      return new Promise((resolve, reject) => {
        MongoClient.connect(config.mongo.uri, (error, db) => {
          if (error) {
            reject(error);
          }

          resolve(db);
        });
      });
    },
  };
};

const DataProvider = ({ db, collectionName }) => ({
  add(obj) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, (err, col) => {
        if (err) {
          reject(err);
        }

        col.insertOne(obj, (error, r) => {
          if (error) {
            reject(error);
          } else {
            resolve(r.insertedCount);
          }
        });
      });
    });
  },

  update(obj, newObj) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, (err, col) => {
        if (err) {
          reject(err);
        }

        col.updateOne({ _id: obj._id },  // eslint-disable-line no-underscore-dangle
          newObj,
          (error, r) => {
            if (error) {
              reject(error);
            } else {
              resolve(r.insertedCount);
            }
          });
      });
    });
  },
});


export {
  Database,
  DataProvider,
};
