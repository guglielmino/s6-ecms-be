import chai from 'chai';
import sinon from 'sinon';
import LwtStatusAlertHandler from './lwtStatusAlertHandler';
import logger from '../../../../../common/logger';
import { AlertsProvider } from '../../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;

describe('lwt status alert handler', () => {

  let subject;
  let alertProvider;
  let socket;
  let loggerStub;

  before(() => {
    loggerStub = sinon.stub(logger, 'log');
    const db = {
      collection: () => {
      },
    };
    alertProvider = AlertsProvider(db);
    socket = {};
    socket.emit = sinon.spy();
    subject = new LwtStatusAlertHandler(alertProvider, socket);
  });

  it('should create alert for device online/offline', () => {
    const addAlertStub = sinon.stub(alertProvider, 'add').returns(Promise.resolve());
    const event = {
      status: 'Online',
      device: {
        gateway: 'gw1',
        deviceId: '22:44:77:33',
        description: 'device test',
        status: { online: true },
      },
    };

    subject.process(event).then(() => {
      addAlertStub.called.should.be.true;
      addAlertStub.calledWith(sinon.match({ gateway: 'gw1', level: 'info', message: 'device test is ONLINE', deviceId: event.device.deviceId })).should.be.true;
      socket.emit.called.should.be.true;
    });
  });

  after(() => {
    loggerStub.restore();
  });

});
