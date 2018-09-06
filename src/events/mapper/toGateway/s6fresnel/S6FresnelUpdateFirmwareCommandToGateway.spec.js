import chai from 'chai';
import S6FresnelUpdateFirmwareCommandToGateway from './S6FresnelUpdateFirmwareCommandToGateway';
import config from '../../../../config';

chai.should();

describe('S6 Fresnel power command to gateway', () => {
  it('should map s6 fresnel payload for gateway', () => {
    const fakeDevice = {
      commands: {
        power: 'mqtt:test',
      },
      deviceId: '1234',
    };
    const expectedResultValue = JSON.stringify({
      method: 'OTA.Update',
      args: {
        url: `${config.devices.s6fresnelotaurl}/fw.zip`,
        commit_timeout: '300',
      },
      src: 'local/update/feedback',
    });

    const result = S6FresnelUpdateFirmwareCommandToGateway(fakeDevice);
    result.should.have.all.keys('topic', 'value');
    result.topic.should.equal(`${fakeDevice.deviceId}/rpc`);
    result.value.should.deep.equal(expectedResultValue);
  });
});
