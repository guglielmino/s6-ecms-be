import chai from 'chai';
import sinon from 'sinon';
import DeviceCrontabHandler from './deviceCrontabHandler';
import logger from '../../../../../common/logger';


chai.should();

describe('Device Crontab Handler', () => {
  let subject;
  let deviceProvider;

  beforeEach(() => {
    deviceProvider = {
      updateByDeviceId: () => {
      },
    };
    subject = new DeviceCrontabHandler(deviceProvider);
  });

  it('should call updateByDeviceId with items array', (done) => {
    sinon.stub(deviceProvider, 'updateByDeviceId')
      .returns(Promise.resolve());

    const event =
      {
        deviceId: '00:11:22:33:44:55',
        payload: {
          crontab:[
            {
              id: 1,
              at: '*/60 * * * * *',
              enable: true,
              action: 'readSensors',
            },
            {
              id: 2,
              at: '0 59 23 * * *',
              enable: true,
              action: 'resetKWh',
            },
          ],
        },
      };

    subject.process(event)
      .then(() => {
        deviceProvider.updateByDeviceId
          .calledOnce.should.be.true;
        deviceProvider.updateByDeviceId
          .calledWith('esp32_03B674', event.payload.crontab);
        done();
      })
      .catch(err => done(err));

  });

});
