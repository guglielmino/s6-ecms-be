import chai from 'chai';
import sinon from 'sinon';
import logger from '../../../../../common/logger';
import CloseAlertHandler from './closeAlertHandler';
import * as consts from '../../../../../common/alertConsts';

chai.should();

describe('Lwt online alert handler', () => {
  let subject;
  let deviceProvider;
  let alertProvider;
  let stubbedLog;

  beforeEach(() => {
    stubbedLog = sinon.stub(logger, 'log');
    deviceProvider = {
      findByDeviceId: () => {},
    };
    alertProvider = {
      getLastAlertByKey: () => {},
      update: () => {},
    };

    sinon.stub(alertProvider, 'getLastAlertByKey').returns(Promise.resolve({
      gateway: 'VG59',
      deviceId: 'esp32_0F0A74',
      message: 'LAMP60 is OFFLINE',
      date: '2018-01-08T15:38:55.786Z',
      read: false,
      open: true,
      key: 'alert:Device_status:VG59:esp32_0F0A74',
      type: 'Device_status',
      level: 'info',
    }));

    sinon.stub(alertProvider, 'update');

    sinon.stub(deviceProvider, 'findByDeviceId').returns(Promise.resolve({
      deviceId: 'esp32_0F0A74',
      name: 'test',
      gateway: 'VG59',
      swVersion: '0.0.7',
      deviceType: 'S6 Fresnel Module',
      description: 'noname',
      status: {
        online: true,
        power: 'off',
      },
    }));

    subject = new CloseAlertHandler(deviceProvider, alertProvider);
  });

  afterEach(() => {
    deviceProvider.findByDeviceId.restore();
    alertProvider.getLastAlertByKey.restore();
    stubbedLog.restore();
  });

  it('should close last alert related to type passed', (done) => {
    const event = {
      device: {
        deviceId: 'esp32_0F0A74',
      },
      type: 'test',
    };

    subject.process(event).then(() => {
      deviceProvider.findByDeviceId
        .called.should.be.true;

      alertProvider.update
        .calledOnce.should.be.true;

      alertProvider.getLastAlertByKey
        .calledOnce.should.be.true;

      alertProvider.update
        .calledWith(sinon.match({},
          {
            gateway: 'VG59',
            deviceId: 'esp32_0F0A74',
            message: 'LAMP60 is OFFLINE',
            date: '2018-01-08T15:38:55.786Z',
            read: false,
            open: false,
            key: 'alert:Device_status:VG59:esp32_0F0A74',
            type: 'Device_status',
            level: 'info',
          })).should.be.true;

      done();
    });
  });

  it('should create alert key', (done) => {
    const event = {
      device:{
        deviceId: 'esp32_0F0A74',
      },
      type: 'test',
    };
    const stubAlertKey = sinon.stub(consts, 'alertKey');

    subject.process(event).then(() => {
      stubAlertKey.calledOnce.should.be.true;

      stubAlertKey.calledWith('test', 'VG59', 'esp32_0F0A74')
        .should.be.true;

      stubAlertKey.restore();
      done();
    });
  });
});
