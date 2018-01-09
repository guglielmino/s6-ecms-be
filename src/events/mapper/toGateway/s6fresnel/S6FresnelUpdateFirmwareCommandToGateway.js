import config from '../../../../config';

const S6FresnelUpdateFirmwareCommandToGateway = dev => ({
  topic: `${dev.deviceId}/rpc`,
  value: JSON.stringify({
    method: 'OTA.Update',
    args: {
      url: `${config.devices.s6fresnelotaurl}/fw.zip`,
      commit_timeout: '300',
    },
    src: 'topic/for/feedback',
  }),
});

export default S6FresnelUpdateFirmwareCommandToGateway;
