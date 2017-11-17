import chai from 'chai';

import APPEventToHandler from './appEventToHandler';

chai.should();
const expect = chai.expect;

describe('APP event to handler mapper', () => {

  it('should transform raw payload to handler payload', () => {
    const msg = {
      type: 'APPEVENT_TYPE_POWER_ALERT',
      deviceId: '13:32:22:34:55:12',
      gateway: 'TEST_GW',
      requestStatus: 'off',
    };

    const result = APPEventToHandler(msg);
    result.deviceId.should.be.eq('13:32:22:34:55:12');
    result.gateway.should.be.eq('TEST_GW');
    result.requestStatus.should.be.eq('off');
  });

});
