import chai from 'chai';

import transformDeviceValues from './deviceValuesTransformer';

chai.should();
const expect = chai.expect;

describe('device values transformer', () => {
  it('should transform device values in response object', () => {
    const date = new Date();
    const res = transformDeviceValues({
      _id: {
        type: 'POWER',
        date,
      },
      value: 3,
      unit: 'W',
     });

    res.type.should.equal('POWER');
    res.date.should.equal(date);
    res.value.should.equal(3);
    res.unit.should.equal('W');
  });
});
