const SONInstaPowerToHourly = e => ({
  timestamp: e.Payload.Time,
  gateway: e.GatewayId,
  deviceId: e.Payload.DeviceId,
  power: parseFloat(e.Payload.Power),
});

export default SONInstaPowerToHourly;
