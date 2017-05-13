

import chai from 'chai';
import sinon from 'sinon';

import {
  transformEvent,
} from './eventTransformer';

chai.should();
const expect = chai.expect;

describe('event transformer', () => {
  it('should transform event in response object', () => {
    const res = transformEvent({
      _id: '588b5e60bdb6577968dbc0a0',
      GatewayId: 'DevelopmentGateway',
      Type: 'ENERGY',
      Payload: {
        DeviceId: 'tele/sonoff/TELEMETRY',
        Yesterday: 52.06,
        Today: 236.4,
        Period: 2,
        Power: 12,
        Factor: 0,
        Voltage: 220,
        Current: 3.35,
        Time: '2017-01-27T14:51:12.524Z',
      },
    });

    res.yesterday.should.be.eq(52.06);
    res.today.should.be.eq(236.4);
    res.period.should.be.eq(2);
    res.voltage.should.be.eq(220);
    res.time.should.be.eq('2017-01-27T14:51:12.524Z');
    res.id.should.eq('588b5e60bdb6577968dbc0a0');
    Object.keys(res).length.should.be.eq(6);
  });
});
