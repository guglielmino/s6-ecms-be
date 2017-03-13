

import chai from 'chai';
import sinon from 'sinon';

import { transformDevice } from './deviceTransformer';

chai.should();
const expect = chai.expect;

describe('device transformer', () => {
  it('should transform device in response object', () => {
    const res = transformDevice({
      deviceId: '87:af:3e:81:ea:39',
      gateway: 'zara1',
      name: 'Lampada 1 - primo piano',
      deviceType: 'Sonoff Pow Module',
      swVersion: '1.0.2',
      commands: [
        {
          power: 'mqtt:cmnd/lamp1/POWER',
        },
      ],
    });

    res.name.should.be.eq('Lampada 1 - primo piano');
    res.deviceId.should.be.eq('87:af:3e:81:ea:39');
    res.type.should.be.eq('Sonoff Pow Module');
    res.version.should.be.eq('1.0.2');
    res.status.should.be.empty;
    Object.keys(res).length.should.be.eq(5);
  });

  it('should map status if present ', () => {
    const res = transformDevice({
      deviceId: '87:af:3e:81:ea:39',
      gateway: 'zara1',
      name: 'Lampada 1 - primo piano',
      deviceType: 'Sonoff Pow Module',
      swVersion: '1.0.2',
      commands: {
          power: 'mqtt:cmnd/lamp1/POWER',
        },
      status: {
        power: "off"
      },
    });

    res.name.should.be.eq('Lampada 1 - primo piano');
    res.deviceId.should.be.eq('87:af:3e:81:ea:39');
    res.type.should.be.eq('Sonoff Pow Module');
    res.version.should.be.eq('1.0.2');
    res.status.should.not.be.null;
    res.status.power.should.be.eq('off');
    Object.keys(res).length.should.be.eq(5);
  });
});
