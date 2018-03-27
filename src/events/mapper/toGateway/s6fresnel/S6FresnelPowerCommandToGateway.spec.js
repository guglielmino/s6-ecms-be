import chai from 'chai';
import S6FresnelPowerCommandToGateway from './S6FresnelPowerCommandToGateway';

chai.should();

describe('S6 Fresnel power command to gateway', () => {
  it('should map s6 fresnel payload for gateway', () => {
    const fakeDevice = {
      commands: {
        power: 'mqtt:test',
      },
    };
    const value = {
      power: 'on',
      relayIdx: 1,
    };

    const result = S6FresnelPowerCommandToGateway(fakeDevice, value);
    result.should.have.all.keys('topic', 'value');
    result.topic.should.equal('test');
    result.value.should.deep.equal({
      relay_idx: 1,
      op: 'on',
    });
  });

  it('should send command to relay 0 if not specified', () => {
    const fakeDevice = {
      commands: {
        power: 'mqtt:test',
      },
    };
    const value = {
      power: 'off',
    };

    const result = S6FresnelPowerCommandToGateway(fakeDevice, value);
    result.should.have.all.keys('topic', 'value');
    result.topic.should.equal('test');
    result.value.should.deep.equal({
      relay_idx: 0,
      op: 'off',
    });
  });
});
