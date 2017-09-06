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

  it('should transform daily stats event in response object formatted for excel', () => {
    const fakeDate = new Date('01/01/2017 15:00:39');

    const res = transformDailyStat({
      _id: fakeDate, // eslint-disable-line no-underscore-dangle
      gateway: 'testGateway',
      today: 5,
    }, 'excel');

    res.date.should.eq('2017-01-01');
    res.gateway.should.eq('testGateway');
    res.consume.should.eq(5);
  });
});
