

import chai from 'chai';
import sinon from 'sinon';

import { transformHourlyStat } from './hourlyStatTransformer';

chai.should();
const expect = chai.expect;

describe('hourly stat transformer', () => {
  it('should transform stat in response object', () => {
    const res = transformHourlyStat({
      _id: 12,
      power: 12.4,
    });

    res.hour.should.be.eq(12);
    res.power.should.be.eq(12.4);
    res.deviceId.should.be.eq('');
    Object.keys(res).length.should.be.eq(3);
  });
});
