import chai from 'chai';
import SONPowerCommandToGateway from './SONPowerCommandToGateway';

chai.should();

describe('Sonoff power command to gateway', () => {
  it('should map sonoff payload for gateway', () => {
    const fakeDevice = {
      commands: {
        power: 'mqtt:test',
      },
    };
    const value = '1';

    const result = SONPowerCommandToGateway(fakeDevice, value);
    result.should.have.all.keys('topic', 'value');
    result.topic.should.equal('test');
    result.value.should.equal(value);
  });
});
