import chai from 'chai';
import sinon from 'sinon';
import LwtStatusAlertHandler from './lwtStatusAlertHandler';
import logger from '../../../../../common/logger';

chai.should();
const expect = chai.expect;

describe('lwt status alert handler', () => {
  let subject;
  let alertProvider;
  let socket;
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger, 'log');

    alertProvider = {
      update: () => {},
      getLastAlertByKey: () => {},
    };
    socket = {};
    socket.emit = sinon.spy();
    subject = new LwtStatusAlertHandler(alertProvider, socket);
  });

  afterEach(() => {
    alertProvider.getLastAlertByKey.restore();
    alertProvider.update.restore();
  });

  it('should create alert for device status if not present', () => {
    sinon.stub(alertProvider, 'getLastAlertByKey').returns(Promise.resolve(null));
    const updateAlertStub = sinon.stub(alertProvider, 'update').returns(Promise.resolve());

    const event = {
      status: 'Offline',
      device: {
        gateway: 'gw1',
        deviceId: '22:44:77:33',
        description: 'device test',
        status: { online: false },
      },
    };

    subject.process(event).then(() => {
      updateAlertStub.calledWith(sinon.match({ gateway: 'gw1', level: 'info', message: 'device test is OFFLINE', deviceId: event.device.deviceId, type: 'Device_status' })).should.be.true;
      socket.emit.called.should.be.true;
    });
  });

  it('should update alert for device status if present', () => {
    sinon.stub(alertProvider, 'getLastAlertByKey').returns(Promise.resolve({
      gateway: 'gw1',
      deviceId: '22:44:77:33',
      message: 'device test is OFFLINE',
      type: 'Device_status',
      key: 'alert:Device_status:gw1:22:44:77:33',
      date: new Date(),
      read: false,
      open: true,
      level: 'info',
    }));

    const updateAlertStub = sinon.stub(alertProvider, 'update').returns(Promise.resolve());

    const event = {
      status: 'Offline',
      device: {
        gateway: 'gw1',
        deviceId: '22:44:77:33',
        description: 'device test',
        status: { online: false },
      },
    };

    subject.process(event).then(() => {
      updateAlertStub.calledWith(sinon.match({
        gateway: 'gw1',
        deviceId: '22:44:77:33',
        message: 'device test is OFFLINE',
        type: 'Device_status',
        key: 'alert:Device_status:gw1:22:44:77:33',
        date: sinon.match.date,
        read: false,
        open: true,
        lastUpdate: sinon.match.date,
      })).should.be.true;
      socket.emit.called.should.be.true;
    });
  });

  after(() => {
    loggerStub.restore();
  });
});
