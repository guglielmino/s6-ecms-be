const S6FInstaPowerToHourly = e => ({
  timestamp: e.Payload.timestamp,
  gateway: e.GatewayId,
  deviceId: e.Payload.deviceId,
  power: e.Payload.power,
});

export default S6FInstaPowerToHourly;
