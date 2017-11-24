import chai from 'chai';
import SONUpdateFirmwareCommandToGateway from './SONUpdateFirmwareCommandToGateway';

chai.should();

describe('Sonoff firmware update command to gateway', () => {
  it('should map sonoff payload to gateway', () => {
    const fakeDevice = { name: 'test device', deviceType: 'sonoff' };

    const result = SONUpdateFirmwareCommandToGateway(fakeDevice);
    result.should.contains.all.keys('topic', 'value');
    result.topic.should.equal('cmnd/test device/Upgrade');
    result.value.should.equal('1');
  });
});
