import chai from 'chai';
import sinon from 'sinon';
import * as consts from '../../../../../consts';
import PowerSwitchFailAlertHandler from './powerSwitchFailAlertHandler';

import helper from '../../processor_tests_helper.spec';
helper('./powerStateAlertCreator');

import { AlertsProvider } from '../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;

describe('PowerSwitchFailAlertHandler', () => {
  let subject;
  let alertProvider, socket = {};

  beforeEach(() => {
    alertProvider = AlertsProvider({});
    subject = PowerSwitchFailAlertHandler(alertProvider, socket);
  });

  it('should add the alert and send it over the socket', (done) => {
    sinon.stub(alertProvider, 'add')
      .returns(Promise.resolve());

    socket.emit = sinon.stub();

    subject.process({
      type: consts.APPEVENT_TYPE_POWER_ALERT,
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: 'off',
    })
      .then(() => {
        alertProvider.add
          .calledOnce.should.be.true;

        alertProvider.add
          .calledWith(sinon.match({ deviceId: '13:32:22:34:55:12', level: 'critical' }))
          .should.be.true;

        socket.emit
          .calledOnce.should.be.true;
        done();
      })
      .catch(err => done(err));
  });
});
