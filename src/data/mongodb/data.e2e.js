import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from './test_helper';
import { DataProvider, InternalDataProvider } from './data';

chai.should();
const expect = chai.expect;

describe('data', () => {

  let db;

  beforeEach((done) => {
    ConnectDb('test_collection', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  context('Generic Data Provider', () => {
    let subject;
    let queryDataProvider;

    beforeEach(() => {
      queryDataProvider = InternalDataProvider({ db, collectionName: 'test_collection' });
      subject = DataProvider({ db, collectionName: 'test_collection' });
    });

    it('Should add a new document', (done) => {
      subject
        .add({
          name: 'test',
          age: 23
        })
        .then((res) => {
          res.inserted.should.be.eq(1);
          res.id.should.not.be.undefined;
          done();
        })
        .catch(err => done(err));
    });

    it('Should update a document by id', (done) => {
      let updatedId;
      subject
        .add({
          name: 'test',
          age: 23,
        })
        .then(res => { updatedId = res.id; return subject.updateById(res.id, { name: 'prova' }); })
        .then(res => queryDataProvider.getById(updatedId))
        .then(obj => {
          obj.name.should.be.eq('prova');
          done();
        })
        .catch(err => done(err));
    });

    it('Should create the object if does\'t exists', (done) => {
      subject
        .updateById('123334a6734d1d44bec9d20d', {
          name: 'test',
          age: 23,
        })
        .then((res) => {
          res.status.should.be.eq(1);
          done();
        })
        .catch(err => done(err));
    });
  });

  context('Internal Data Provider', () => {
    let subject;
    let genericProvider;

    beforeEach(() => {
      genericProvider = DataProvider({ db, collectionName: 'test_collection' });
      subject = InternalDataProvider({ db, collectionName: 'test_collection' });
    });

    it('Should get a document by id', (done) => {
      genericProvider
        .add({
          name: 'test',
          age: 23,
        })
        .then(res => subject.getById(res.id))
        .then(obj => {
          obj.name.should.be.eq('test');
          obj.age.should.be.eq(23);
          done();
        })
        .catch(err => done(err));
    });

    it('Should return null if id doesn\'t exists', (done) => {
      subject.getById('123334a6734d1d44bec9d20d')
        .then(obj => {
          expect(obj).to.be.null;
          done();
        })
        .catch(err => done(err));
    });

    it('Should get top N elements', (done) => {
      genericProvider
      .add({
        name: 'test',
        age: 23,
      })
      .then(() => genericProvider.add({
        name: 'test 1',
        age: 23,
      }))
      .then(() => genericProvider.add({
        name: 'test 2',
        age: 23,
      }))
      .then(() => genericProvider.add({
        name: 'test 5',
        age: 40,
      }))
      .then(() => subject.getMany({ age: 23 }, 2))
      .then((obj) => {
        obj.length.should.be.eq(2);
        obj[0].age.should.eq(23);
        obj[1].age.should.eq(23);
        done();
      })
      .catch(err => done(err));
    });

    it('Should get all elements matching query if limit is not provided', (done) => {
      genericProvider
      .add({
        name: 'test',
        age: 23,
      })
      .then(() => genericProvider.add({
        name: 'test 1',
        age: 23,
      }))
      .then(() => genericProvider.add({
        name: 'test 2',
        age: 23,
      }))
      .then(() => genericProvider.add({
        name: 'test 5',
        age: 40,
      }))
      .then(() => subject.getMany({ age: 23 }))
      .then((obj) => {
        obj.length.should.be.eq(3);
        obj[0].age.should.eq(23);
        obj[1].age.should.eq(23);
        obj[2].age.should.eq(23);
        done();
      })
      .catch(err => done(err));
    });

    it('Should delete a document matching passed query', (done) => {
      genericProvider
        .add({
          name: 'Phil',
          age: 23,
        })
        .then(res => subject.deleteOne({ age: 23 }))
        .then(obj => {
          obj.should.be.true;
          return subject.getOne({ age: 23 });
        })
        .then(device => {
          expect(device).to.be.null;
          done();
        })
        .catch(err => done(err));
    });

  });
});
