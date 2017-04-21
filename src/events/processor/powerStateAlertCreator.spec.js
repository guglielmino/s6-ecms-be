import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../consts';
import PowerStateAlertCreator from './powerStateAlertCreator';
import mockery from "mockery";

chai.should();
const expect = chai.expect;

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
});

describe('PowerStateAlertCreator', () => {
  let subject;
  let alertProvider = {}, socket = {};

  beforeEach(() => {
    mockery.enable();
    mockery.registerAllowable('./index');
    mockery.registerMock('../../common/logger', { log: () => {} });

    subject = PowerStateAlertCreator({ alertProvider }, socket);
  });

  it('should add the alert and send it over the socket', () => {
    alertProvider.add = sinon.stub();
    socket.emit = sinon.stub();

    subject.process({
      type: consts.APPEVENT_TYPE_POWER_ALERT,
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: 'off',
    });

    alertProvider.add
      .calledOnce.should.be.true;

    alertProvider.add
      .calledWith(sinon.match({ deviceId: '13:32:22:34:55:12' })).should.be.true;

    socket.emit
      .calledOnce.should.be.true;
  });

});
