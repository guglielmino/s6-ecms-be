import chai from 'chai';
import sinon from 'sinon';
import logger from '../../../../../common/logger';

import DeviceValuesHandler from './deviceValuesHandler';

import { DeviceValuesProvider } from '../../../../../data/mongodb/index';

chai.should();
const expect = chai.expect;


describe('HourlyStatHandler', () => {
  let deviceValuesProvider;
  let subject;

  beforeEach(() => {
    sinon.stub(logger, 'log');

    const db = {
      collection: () => {
      },
    };

    deviceValuesProvider = DeviceValuesProvider(db);
    subject = new DeviceValuesHandler(deviceValuesProvider);
  });

  it('should call updateDeviceValues passing right payload data', (done) => {
    const event = {
      gateway: 'CASAFG',
      deviceId: '00:11:22:33:44:55',
      timestamp: '2017-08-27T07:56:23.642Z',
      value: 6,
      unit: 'V',
      type: 'VOLTAGE',
    };

    const providerStub = sinon.stub(deviceValuesProvider, 'updateDeviceValues')
      .returns(Promise.resolve());

    subject.process(event)
      .then(() => {
        providerStub
          .calledWith(sinon.match({ unit: 'V', type: 'VOLTAGE', value: 6, gateway: 'CASAFG', deviceId: '00:11:22:33:44:55' }))
          .should.be.true;
        done();
      })
      .catch(err => done(err));
  });

  afterEach(() => {
    logger.log.restore();
  });

});
