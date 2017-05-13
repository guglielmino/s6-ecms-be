/**
 * Created by alessiapileri on 27/04/2017.
 */

import chai from 'chai';
import { transformDailyStat } from './dailyStatTransformer';

chai.should();
describe('daily stats transformer', () => {
  it('should transform daily stats event in response object', () => {
    const fakeDate = new Date();

    const res = transformDailyStat({
      _id: fakeDate, // eslint-disable-line no-underscore-dangle
      gateway: 'testGateway',
      today: 5,
    });
    res.date.should.eq(fakeDate);
    res.gateway.should.eq('testGateway');
    res.value.should.eq(5);
  });

});
