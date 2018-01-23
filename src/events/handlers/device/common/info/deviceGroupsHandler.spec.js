import chai from 'chai';
import sinon from 'sinon';
import DeviceGroupsHandler from './deviceGroupsHandler';
import logger from '../../../../../common/logger';

chai.should();

describe('Device Groups Handler', () => {
  let deviceGroupsProvider;
  let subject;

  before(() => {
    sinon.stub(logger, 'log');
  });

  beforeEach(() => {
    deviceGroupsProvider = {
      updateByGroupCode: () => {},
    };
    subject = new DeviceGroupsHandler(deviceGroupsProvider);
  });

  it('should call provider\'s add method for current payload', () => {
    const stubMethod = sinon.stub(deviceGroupsProvider, 'updateByGroupCode')
      .returns(Promise.resolve());

    const event = {
      code: 'test',
      payload: {
        gateway: 'gw',
        description: 'test',
        created: new Date(),
      },
    };

    subject.process(event).then(() => {
      stubMethod.calledOnce.should.be.true;
      stubMethod.calledWith('test', sinon.match({
        gateway: 'gw',
        description: 'test',
        created: sinon.match.date,
      })).should.be.true;
    });
  });

  after(() => {
    logger.log.restore();
  });

  afterEach(() => {
    deviceGroupsProvider.updateByGroupCode.restore();
  });
});
