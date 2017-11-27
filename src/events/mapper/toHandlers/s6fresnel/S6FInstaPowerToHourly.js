const S6FInstaPowerToHourly = e => ({
  timestamp: e.Payload.timestamp,
  gateway: e.GatewayId,
  deviceId: e.Payload.deviceId,
  power: e.Payload.value,
});

export default S6FInstaPowerToHourly;
