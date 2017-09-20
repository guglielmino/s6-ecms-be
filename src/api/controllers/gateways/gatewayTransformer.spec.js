import chai from 'chai';

import { transformGateway } from './gatewayTransformer';

chai.should();

describe('device transformer', () => {
  it('should transform gateway in response object', () => {
    const res = transformGateway({
      _id: '5893348f734d1d44bec9d20b',
      code: 'test',
      description: 'testing gateway',
      authKey: 'hhbbh0a',
    });

    res.id.should.be.eq('5893348f734d1d44bec9d20b');
    res.code.should.be.eq('test');
    res.description.should.be.eq('testing gateway');
    res.authKey.should.be.eq('hhbbh0a');
    Object.keys(res).length.should.be.eq(4);
  });
});
