

import chai from 'chai';
import sinon from 'sinon';

import { transformHourlyStat } from './hourlyStatTransformer';

chai.should();
const expect = chai.expect;

describe('hourly stat transformer', () => {
  it('should transform stat in response object', () => {
    const date = new Date();
    const res = transformHourlyStat({
      _id: { date },
      power: 12.4,
      device: [],
    });

    res.date.should.be.eq(date);
    res.power.should.be.eq(12.4);
    res.deviceId.should.be.eq('');
    res.deviceName.should.be.eq('');
    Object.keys(res).length.should.be.eq(4);
  });

  it('should transform stat in response object with deviceId', () => {
    const date = new Date();
    const res = transformHourlyStat({
      _id: { date, deviceId: '11:22:33:44' },
      power: 12.4,
      device: [{ name: 'test', deviceId: '11:22:33:44' }],
    });

    res.date.should.be.eq(date);
    res.power.should.be.eq(12.4);
    res.deviceId.should.be.eq('11:22:33:44');
    res.deviceName.should.be.eq('test');
    Object.keys(res).length.should.be.eq(4);
  });
});
