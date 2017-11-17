const SONUpdateFirmwareCommandToGateway = dev => ({
  topic: `cmnd/${dev.name}/Upgrade`,
  value: '1',
});

export default SONUpdateFirmwareCommandToGateway;
