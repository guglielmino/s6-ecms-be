import chai from 'chai';
import sinon from 'sinon';
import EnergyAlertProcessor from './energyAlertProcessor';
import mockery from "mockery";

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
    mockery.registerMock('../../common/logger', { log: () => {} });

    deviceProvider = {};
    alertProvider = {};
    socket = {};
    subject = new EnergyAlertProcessor({ deviceProvider, alertProvider }, socket);
  });

  it('should do nothing if power is greater than 0', () => {
    const event = {
      GatewayId: 'TESTGW',
      Type: 'ENERGY',
      Payload: {
        DeviceId: '11:22:33:44:55',
        Yesterday: 0.031,
        Today: 0.013,
        Period: 0,
        Power: 123,
        Factor: 0,
        Voltage: 0,
        Current: 0,
        Time: new Date(),
        created: new Date(),
      }
    };

    deviceProvider.findByDeviceId = sinon.stub();

    subject.process(event);

    deviceProvider.findByDeviceId
      .called.should.be.false;
  });

  it('should create alert and emit if power is greater than 0 and device power status is off', (done) => {
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

    deviceProvider.findByDeviceId = sinon.stub()
      .returns(Promise.resolve({
        gateway: 'TESTGW',
        name: 'lamp_test',
        swVersion: '1.2.3',
        deviceType: 'Sonoff Pow Module',
        deviceId: '11:22:33:44:55',
        commands: {
          power: 'mqtt:cmnd/lamp_test/POWER',
        },
        created: new Date(),
        status: {
          power: 'on',
        },
      }));

    alertProvider.add = sinon.stub();
    socket.emit = () => {
      alertProvider.add
        .calledOnce.should.be.true;

      deviceProvider.findByDeviceId
        .called.should.be.true;

      done();
    };

    subject.process(event);

  });
});
