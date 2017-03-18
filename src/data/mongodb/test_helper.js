import { Database } from './data';

function ConnectDb(collectionName, cb) {
  const database = Database({
    mongo: {
      uri: 'mongodb://iot-user:iot-user-pwd@ds027308.mlab.com:27308/iot-project-test',
    },
  });

  database.connect()
    .then((_db) => {
      _db.listCollections({ name: collectionName })
        .next((lstErr, collinfo) => {
          if (lstErr) {
            cb(lstErr);
          }

          if (collinfo) {
            _db.collection(collectionName, (err, col) => {
              if (err) {
                cb(err);
              }
              col.drop((error) => {
                if (error) {
                  cb(error);
                } else {
                  cb(null, _db);
                }
              });
            });
          } else {
            cb(null, _db);
          }
        });
    })
    .catch(err => cb(err));
}

export default ConnectDb;
