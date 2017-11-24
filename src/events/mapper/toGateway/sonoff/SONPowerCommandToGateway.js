const SONPowerToGateway = (dev, param) => ({
  topic: dev.commands.power.replace('mqtt:', ''),
  value: param,
});

export default SONPowerToGateway;
