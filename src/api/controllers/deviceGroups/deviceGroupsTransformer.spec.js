import chai from 'chai';
import deviceGroupTranformer from './deviceGroupsTransformer';

chai.should();

describe('device group transformer', () => {
  it('should transform deviceGroups in response object', () => {
    const devGroup = {
      _id: '123',
      code: 'groupCode',
      description: 'groupDescription',
      gateway: 'groupGateway',
    };

    const resp = deviceGroupTranformer(devGroup);
    Object.keys(resp).length.should.be.eq(4);
    resp.id.should.be.eq('123');
    resp.code.should.be.eq('groupCode');
    resp.description.should.be.eq('groupDescription');
    resp.gateway.should.be.eq('groupGateway');
  });
});
