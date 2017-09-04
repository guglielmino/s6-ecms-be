import chai from 'chai';
import sinon from 'sinon';
import EnergyAlertHandler, { needsNewAlert, makeAlertKey }  from './energyAlertHandler';

import helper from '../../../processor_tests_helper.spec';
helper('./energyAlertProcessor');

import { AlertsProvider, DevicesProvider } from '../../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;


describe('EnergyAlertHandler', () => {

 context('Main module', () => {
    let subject;
    let deviceProvider, alertProvider;
    let socket;

    beforeEach(() => {
      const db = {
        collection: () => {
        }
      };
      deviceProvider = DevicesProvider(db);
      alertProvider = AlertsProvider(db);
      socket = {};
      subject = new EnergyAlertHandler(deviceProvider, alertProvider, socket);
    });

    it('should do nothing if power is greater than 0', (done) => {
      const event = {
        GatewayId: 'TESTGW',
        Type: 'ENERGY',
        Payload: {
          DeviceId: 'tele/lamp_test/TELEMETRY',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: new Date(),
          created: new Date(),
        },
      };

      sinon.stub(deviceProvider, 'findByDeviceId');

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId
            .called.should.be.false;
          done();
        })
        .catch(err => done(err));
    });

    it('should create alert when power > 0, device status is on and there aren\'t previous alerts for the device/gateway', (done) => {
      const event = {
        GatewayId: 'TESTGW',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:22:33:44:55',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 0,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: new Date(),
          created: new Date(),
        },
      };

      const eventDate = new Date();

      sinon.stub(deviceProvider, 'findByDeviceId')
        .returns(Promise.resolve({
          gateway: 'TESTGW',
          name: 'lamp_test',
          swVersion: '1.2.3',
          deviceType: 'Sonoff Pow Module',
          deviceId: '11:22:33:44:55',
          commands: {
            power: 'mqtt:cmnd/lamp_test/POWER',
          },
          created: eventDate,
          status: {
            power: 'on',
          },
        }));

      sinon.stub(alertProvider, 'getLastAlertByKey')
        .returns(Promise.resolve(null));

      sinon.stub(alertProvider, 'update');

      socket.emit = sinon.stub();

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId
            .called.should.be.true;

          alertProvider.update
            .calledOnce.should.be.true;

            alertProvider.update
            .calledWith(sinon.match({
              gateway: 'TESTGW',
              deviceId: '11:22:33:44:55',
              message: 'lamp_test could be broken, power is 0 while state is on',
              read: false,
              level: 'critical',
              key: 'alert:energy:TESTGW:11:22:33:44:55',
            })).should.be.true;

          socket.emit.calledOnce.should.be.true;
          done();
        })
        .catch(err => done(err));
    });
  });

  context('needsNewAlert', () => {

    it('should return true if alert is null', () => {
      needsNewAlert(null).should.be.true;
    });

    it('should return true if alert is older than delay', () => {
      const now = new Date('2017-05-11 10:00:00.000Z');
      const last = new Date('2017-05-11 09:54:59.000Z')

      needsNewAlert({
        date: now,
        lastUpdate: last,
      }, now, 300).should.be.true;
    });

    it('should return false if alert isn\'t older than delay', () => {
      const now = new Date('2017-05-11 10:00:00.000Z');
      const last = new Date('2017-05-11 09:56:00.000Z')

      needsNewAlert({
        date: now,
        lastUpdate: last,
      }, now, 300).should.be.false;
    });
  });

  context('makeAlertKey', () => {
    it('should create the alert key for the device', () => {
      makeAlertKey({
        name: 'lamp1',
        gateway: 'VG59',
        swVersion: '3.2.14',
        deviceType: 'Sonoff Pow Module',
        deviceId: '5C:CF:7F:A0:16:46',
      }).should.be.eq('alert:energy:VG59:5C:CF:7F:A0:16:46');
    })
  })
});
