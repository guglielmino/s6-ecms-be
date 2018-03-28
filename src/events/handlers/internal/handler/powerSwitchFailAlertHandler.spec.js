import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../../../consts';
import PowerSwitchFailAlertHandler from './powerSwitchFailAlertHandler';
import logger from '../../../../common/logger';

chai.should();
const expect = chai.expect;

describe('PowerSwitchFailAlertHandler', () => {
  let subject;
  let alertProvider,
    socket = {};
  let devicesProvider;
  let stubLogger;

  beforeEach(() => {
    stubLogger = sinon.stub(logger, 'log');
    alertProvider = { add: () => {} };
    devicesProvider = { findByDeviceId: () => {} };
    subject = PowerSwitchFailAlertHandler(alertProvider, devicesProvider, socket);
  });

  afterEach(() => {
    stubLogger.restore();
  });

  it('should add the alert and send it over the socket', (done) => {
    sinon.stub(alertProvider, 'add')
      .returns(Promise.resolve());


    sinon.stub(devicesProvider, 'findByDeviceId')
      .returns(Promise.resolve({
        deviceId: '13:32:22:34:55:12',
        name: 'test',
        description: 'test dev',
      }));

    socket.emit = sinon.stub();

    subject.process({
      type: consts.APPEVENT_TYPE_POWER_ALERT,
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: {
        power: 'off',
        relayIdx: 1,
      },
    })
      .then(() => {

        devicesProvider.findByDeviceId.calledOnce.should.be.true;
        devicesProvider.findByDeviceId.calledWith('13:32:22:34:55:12').should.be.true;

        alertProvider.add
          .calledOnce.should.be.true;

        alertProvider.add
          .calledWith({
            gateway: 'TEST_GW',
            deviceId: '13:32:22:34:55:12',
            message: 'test dev doesn\'t respond to turn off on relay 1',
            type: 'Power_switch_fail',
            key: 'alert:Power_switch_fail:TEST_GW:13:32:22:34:55:12',
            date: sinon.match.date,
            read: false,
            open: true,
            level: 'critical',
          })
          .should.be.true;

        socket.emit
          .calledOnce.should.be.true;
        socket.emit
          .calledWith('TEST_GW', 'WS_ALERT_DEVICE', sinon.match.any)
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should return error if it doesn\'t retrieve device from deviceId', (done) => {
    sinon.stub(devicesProvider, 'findByDeviceId')
      .returns(Promise.resolve(null));

    subject.process({
      type: consts.APPEVENT_TYPE_POWER_ALERT,
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: 'off',
    })
      .catch((err) => {
        err.message.should.equal('Error in PowerSwitchFailAlertHandler: 13:32:22:34:55:12 not found');
        done();
      });
  });
});
