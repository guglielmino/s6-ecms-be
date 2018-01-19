import chai from 'chai';
import sinon from 'sinon';
import PowerAlertHandler from './powerAlertHandler';
import * as alertConsts from '../../../../../common/alertConsts';

import helper from '../../../processor_tests_helper.spec';

helper('./energyAlertProcessor');

chai.should();
const expect = chai.expect;


describe('PowerAlertHandler', () => {
  context('Main module', () => {
    let subject;
    let deviceProvider,
      alertProvider;
    let socket;

    beforeEach(() => {
      const db = {
        collection: () => {
        },
      };
      deviceProvider = {
        findByDeviceId: () => {},
      };
      alertProvider = {
        getLastAlertByKey: () => {},
        update: () => {},
      };
      socket = {};
      subject = new PowerAlertHandler(deviceProvider, alertProvider, socket);
    });

    it('should create the alert key for the device', (done) => {
      const stubAlert = sinon.stub(alertConsts, 'alertKey');

      const fakeDevice = {
        gateway: 'TESTGW',
        name: 'lamp_test',
        swVersion: '1.2.3',
        deviceType: 'Sonoff Pow Module',
        deviceId: '00:11:22:33:44:55',
        commands: {
          power: 'mqtt:cmnd/lamp_test/POWER',
        },
        created: new Date(),
        status: {
          power: 'on',
        },
      };

      sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve(fakeDevice));

      sinon.stub(alertProvider, 'getLastAlertByKey')
       .returns(Promise.resolve(null));

      socket.emit = sinon.stub();

      const event = {
        deviceId: '00:11:22:33:44:55',
        power: 0,
      };

      subject.process(event).then(() => {
        stubAlert.called.should.be.true;
        stubAlert.calledWith(alertConsts.types.ALERT_TYPE_DEVICE_BROKEN, fakeDevice.gateway, fakeDevice.deviceId).should.be.true;
        stubAlert.restore();
        done();
      });
    });

    it('should create alert when device status is on and there aren\'t previous alerts for the device/gateway', (done) => {
      const event = {
        deviceId: '00:11:22:33:44:55',
        power: 0,
      };

      const eventDate = new Date();

      sinon.stub(deviceProvider, 'findByDeviceId')
        .returns(Promise.resolve({
          gateway: 'TESTGW',
          name: 'lamp_test',
          swVersion: '1.2.3',
          deviceType: 'Sonoff Pow Module',
          deviceId: '00:11:22:33:44:55',
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
              deviceId: '00:11:22:33:44:55',
              message: 'lamp_test could be broken, power is 0 while state is on',
              read: false,
              open: true,
              type: 'Device_broken',
              level: 'critical',
              key: 'alert:Device_broken:TESTGW:00:11:22:33:44:55',
            })).should.be.true;

          socket.emit.calledOnce.should.be.true;
          done();
        })
        .catch(err => done(err));
    });

    it('should update previous alert when device status is on and there is a previous alert', (done) => {
      const event = {
        deviceId: '00:11:22:33:44:55',
        power: 0,
      };

      const eventDate = new Date();

      sinon.stub(deviceProvider, 'findByDeviceId')
        .returns(Promise.resolve({
          gateway: 'TESTGW',
          name: 'lamp_test',
          swVersion: '1.2.3',
          deviceType: 'Sonoff Pow Module',
          deviceId: '00:11:22:33:44:55',
          commands: {
            power: 'mqtt:cmnd/lamp_test/POWER',
          },
          created: eventDate,
          status: {
            power: 'on',
          },
        }));

      sinon.stub(alertProvider, 'getLastAlertByKey')
        .returns(Promise.resolve({
          gateway: 'VG59',
          deviceId: '5C:CF:7F:A0:16:46',
          message: 'LAMP60 is OFFLINE',
          date: new Date(),
          read: false,
          open: true,
          level: 'info',
        }));

      sinon.stub(alertProvider, 'update');

      socket.emit = sinon.stub();

      subject.process(event)
        .then(() => {
          deviceProvider.findByDeviceId
            .called.should.be.true;

          alertProvider.update
            .calledOnce.should.be.true;

          alertProvider.update
            .calledWith(sinon.match({},{
              gateway: 'VG59',
              deviceId: '5C:CF:7F:A0:16:46',
              message: 'LAMP60 is OFFLINE',
              date: new Date(),
              read: false,
              open: true,
              level: 'info',
              lastUpdate: sinon.match.date,
            })).should.be.true;

          socket.emit.calledOnce.should.be.true;
          done();
        })
        .catch(err => done(err));
    });
  });
});
