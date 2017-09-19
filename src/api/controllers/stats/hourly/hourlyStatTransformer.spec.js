

import chai from 'chai';
import sinon from 'sinon';

import { transformHourlyStat } from './hourlyStatTransformer';

chai.should();
const expect = chai.expect;

describe('hourly stat transformer', () => {
  it('should transform stat in response object', () => {
    const res = transformHourlyStat({
      _id: { hour: 12 },
      power: 12.4,
      device: [],
    });

    res.hour.should.be.eq(12);
    res.power.should.be.eq(12.4);
    res.deviceId.should.be.eq('');
    res.deviceName.should.be.eq('');
    Object.keys(res).length.should.be.eq(4);
  });

  it('should transform stat in response object with deviceId', () => {
    const res = transformHourlyStat({
      _id: { hour: 12, deviceId: '11:22:33:44' },
      power: 12.4,
      device: [{ name: 'test', deviceId: '11:22:33:44' }],
    });

    res.hour.should.be.eq(12);
    res.power.should.be.eq(12.4);
    res.deviceId.should.be.eq('11:22:33:44');
    res.deviceName.should.be.eq('test');
    Object.keys(res).length.should.be.eq(4);
  });
});
