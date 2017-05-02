import chai from 'chai';
import sinon from 'sinon';
import EnergyAlertProcessor from './energyAlertProcessor';

import mockery from "mockery";

import { AlertsProvider, DevicesProvider } from '../../data/mongodb';

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});

describe('EnergyAlertProcessor', () => {
  let subject;
  let deviceProvider, alertProvider;
  let socket;

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', {
      log: () => {
      }
    });

    const db = {
      collection: () => {
      }
    };
    deviceProvider = DevicesProvider(db);
    alertProvider = AlertsProvider(db);
    socket = {};
    subject = new EnergyAlertProcessor({ deviceProvider, alertProvider }, socket);
  });

  it('should do nothing if power is greater than 0', () => {
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

    subject.process(event);

    deviceProvider.findByDeviceId
      .called.should.be.false;
  });

  it('should create alert and emit if power is greater than 0 and device power status is off', (done) => {
    const event = {
      GatewayId: 'TESTGW',
      Type: 'ENERGY',
      Payload: {
        DeviceId: 'tele/lamp_test/TELEMETRY',
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

    sinon.stub(alertProvider, 'add');
    socket.emit = () => {
      alertProvider.add
        .calledOnce.should.be.true;

      alertProvider.add.calledWith({
        gateway: 'TESTGW',
        date: eventDate,
        deviceId: '11:22:33:44:55',
        message: 'lamp_test could be broken, power is 0 while state is on',
        read: false,
        level: 'critical',
      });

      deviceProvider.findByDeviceId
        .called.should.be.true;

      done();
    };

    subject.process(event);

  });
});
