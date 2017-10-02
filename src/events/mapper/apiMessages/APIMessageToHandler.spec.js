import chai from 'chai';

import APIMessageToHandler from './APIMessageToHandler';

chai.should();
const expect = chai.expect;

describe('API Message to handler mapper', () => {

  it('should transform raw payload to handler payload', () => {
    const msg = {
      deviceId: '00:11:22:33:44:55',
      gateway: 'test gw',
    };

    const result = APIMessageToHandler(msg);
    result.deviceId.should.be.eq('00:11:22:33:44:55');
    result.gateway.should.be.eq('test gw');
    expect(result.param).to.be.null;
  });

  it('should transform raw payload to handler payload with param', () => {

    const msg = {
      deviceId: '00:11:22:33:44:55',
      gateway: 'test gw',
      param: '123',
    };

    const result = APIMessageToHandler(msg);
    result.deviceId.should.be.eq('00:11:22:33:44:55');
    result.gateway.should.be.eq('test gw');
    result.param.should.be.eq('123');
  });
});
