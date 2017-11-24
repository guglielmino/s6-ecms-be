const S6FresnelPowerToGateway = (dev, param) => ({
  topic: dev.commands.power.replace('mqtt:', ''),
  value: param,
});

export default S6FresnelPowerToGateway;
