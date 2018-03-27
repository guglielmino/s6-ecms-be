const S6FresnelPowerToGateway = (dev, param) => ({
  topic: dev.commands.power.replace('mqtt:', ''),
  value: {
    relay_idx: param.relayIdx || 0,
    op: param.power,
  },
});

export default S6FresnelPowerToGateway;
