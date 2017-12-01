import chai from 'chai';
import sinon from 'sinon';

import ConnectDb from '../test_helper';
import DeviceValuesProvider from './deviceValuesProvider';

chai.should();
const expect = chai.expect;

describe('device values provider', () => {
  let subject;
  let db;

  beforeEach((done) => {
    ConnectDb('deviceValues', (err, _db) => {
      if (err) {
        done(err);
      }

      db = _db;
      done();
    });
  });

  it('should update device values', (done) => {
    subject = DeviceValuesProvider(db);
    const date = new Date();

    subject
      .updateDeviceValues({
        date,
        gateway: 'test_gateway',
        deviceId: '11:22:33:44:55:66',
        type: 'POWER',
        value: 12.3,
        unit: 'W',
      })
      .then((res) => {
        res.should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should retrieve aggegate values for given device and data', (done) => {
    subject = DeviceValuesProvider(db);

    const date = new Date();
    const hour = date.getHours();
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    subject
      .updateDeviceValues({
        date,
        gateway: 'test_gateway',
        deviceId: '11:22:33:44:55:66',
        type: 'POWER',
        value: 12.3,
        unit: 'W',
      })
      .then(() =>{
        return subject
          .updateDeviceValues({
            date,
            gateway: 'test_gateway',
            deviceId: '11:22:33:44:55:66',
            type: 'FREQUENCY',
            value: 120.3,
            unit: 'Hz',
          });
      })
      .then(() => {
        return subject
          .updateDeviceValues({
            date,
            gateway: 'test_gateway',
            deviceId: '11:22:33:44:55:66',
            type: 'POWER',
            value: 10.3,
            unit: 'W',
          });
      })
      .then(() => {
        return subject
          .updateDeviceValues({
            date: tomorrow,
            gateway: 'test_gateway',
            deviceId: '11:22:33:44:55:66',
            type: 'POWER',
            value: 12.3,
            unit: 'W',
          });
      })
      .then(() => {
        return subject.getDeviceValues(date, '11:22:33:44:55:66');
      })
      .then((res) => {
        const refDate = new Date(date);
        refDate.setUTCMinutes(0);
        refDate.setUTCSeconds(0);
        refDate.setUTCMilliseconds(0);

        res.length.should.equal(2);
        res[0].should.have.all.keys('_id', 'value', 'unit');
        res[1].should.have.all.keys('_id', 'value', 'unit');

        res[0]._id.type.should.equal('POWER');
        res[0]._id.date.should.deep.equal(refDate);
        res[0].value.should.equal(10.3);
        res[0].unit.should.equal('W');

        res[1]._id.type.should.equal('FREQUENCY');
        res[1]._id.date.should.deep.equal(refDate);
        res[1].value.should.equal(120.3);
        res[1].unit.should.equal('Hz');
        done();
      })
      .catch(err => done(err));
  });
});
