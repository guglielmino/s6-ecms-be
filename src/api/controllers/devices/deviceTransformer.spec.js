import chai from 'chai';

import { transformDevice } from './deviceTransformer';

chai.should();
const expect = chai.expect;

describe('device transformer', () => {
  it('should transform device in response object', () => {
    const res = transformDevice({
      deviceId: '87:af:3e:81:ea:39',
      gateway: 'zara1',
      name: 'Lampada 1',
      description: 'Lampada 1 - primo piano',
      deviceType: 'Sonoff Pow Module',
      swVersion: '1.0.2',
      features: ['Relay1', 'Relay2', 'Power'],
      commands: [
        {
          power: 'mqtt:cmnd/lamp1/POWER',
        },
      ],
    });

    res.name.should.be.eq('Lampada 1');
    res.description.should.be.eq('Lampada 1 - primo piano');
    res.deviceId.should.be.eq('87:af:3e:81:ea:39');
    res.type.should.be.eq('Sonoff Pow Module');
    res.version.should.be.eq('1.0.2');
    res.gateway.should.be.eq('zara1');
    res.features.should.be.deep.eq(['Relay1', 'Relay2', 'Power']);
    res.status.should.be.empty;
    res.tags.should.be.empty;
    Object.keys(res).length.should.be.eq(10);
  });

  it('should map status if present ', () => {
    const res = transformDevice({
      deviceId: '87:af:3e:81:ea:39',
      gateway: 'zara1',
      name: 'Lampada 1',
      description: 'Lampada 1 - primo piano',
      deviceType: 'Sonoff Pow Module',
      swVersion: '1.0.2',
      commands: {
        power: 'mqtt:cmnd/lamp1/POWER',
      },
      status: {
        power: 'off',
      },
      _id: '58c55e7af36d281631b3f6b6',
    });

    res.name.should.be.eq('Lampada 1');
    res.description.should.be.eq('Lampada 1 - primo piano');
    res.deviceId.should.be.eq('87:af:3e:81:ea:39');
    res.type.should.be.eq('Sonoff Pow Module');
    res.version.should.be.eq('1.0.2');
    res.status.should.not.be.null;
    res.status.power.should.be.eq('off');
    res.id.should.eq('58c55e7af36d281631b3f6b6');
    res.gateway.should.eq('zara1');
    res.features.should.be.deep.eq([]);
    res.tags.should.be.empty;
    Object.keys(res).length.should.be.eq(10);
  });

  it('should map tags if present ', () => {
    const res = transformDevice({
      deviceId: '87:af:3e:81:ea:39',
      gateway: 'zara1',
      name: 'Lampada 1',
      description: 'Lampada 1 - primo piano',
      deviceType: 'Sonoff Pow Module',
      swVersion: '1.0.2',
      commands: {
        power: 'mqtt:cmnd/lamp1/POWER',
      },
      status: {
        power: 'off',
      },
      tags: ['tag1', 'tag2'],
      _id: '58c55e7af36d281631b3f6b6',
    });

    res.name.should.be.eq('Lampada 1');
    res.description.should.be.eq('Lampada 1 - primo piano');
    res.deviceId.should.be.eq('87:af:3e:81:ea:39');
    res.type.should.be.eq('Sonoff Pow Module');
    res.version.should.be.eq('1.0.2');
    res.status.should.not.be.null;
    res.status.power.should.be.eq('off');
    res.id.should.eq('58c55e7af36d281631b3f6b6');
    res.gateway.should.eq('zara1');
    res.features.should.be.deep.eq([]);
    res.tags.should.be.deep.eq(['tag1', 'tag2']);
    Object.keys(res).length.should.be.eq(10);
  });
});
