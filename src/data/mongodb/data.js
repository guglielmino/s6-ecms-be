import MongoClient, { ObjectId } from 'mongodb';

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
            resolve({ inserted: r.insertedCount, id: r.insertedId });
          }
        });
      });
    });
  },

  update(obj, newObj) {
    return this.updateById(obj._id, newObj); // eslint-disable-line no-underscore-dangle
  },

  updateById(id, newObj) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, (err, col) => {
        if (err) {
          reject(err);
        }

        let _id = id; // eslint-disable-line no-underscore-dangle
        if (typeof id === 'string' || id instanceof String) {
          _id = ObjectId(id);
        }

        col.findOneAndUpdate({ _id },  // eslint-disable-line no-underscore-dangle
          newObj,
          {
            upsert: true,
            returnOriginal: true,
          },
          (error, r) => {
            if (error) {
              reject(error);
            } else {
              const id = r.lastErrorObject.upserted ? r.lastErrorObject.upserted : r.value._id;
              resolve({ status: r.ok, id: id });
            }
          });
      });
    });
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, (err, col) => {
        if (err) {
          reject(err);
        }

        col.findOne({ _id: ObjectId(id) }, // eslint-disable-line no-underscore-dangle
          (error, obj) => {
            if (error) {
              reject(error);
            } else {
              resolve(obj);
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
