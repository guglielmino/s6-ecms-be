const S6FresnelPowerToGateway = (dev, param) => ({
  topic: dev.commands.power.replace('mqtt:', ''),
  value: JSON.stringify({
    relay_idx: param.relayIdx || 0,
    op: param.power,
  }),
});

export default S6FresnelPowerToGateway;
