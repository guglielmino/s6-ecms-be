const SONDailyConsumeToDaily = e => ({
  timestamp: e.Payload.Time,
  gateway: e.GatewayId,
  deviceId: e.Payload.DeviceId,
  dailyconsume: e.Payload.Today,
});

export default SONDailyConsumeToDaily;
