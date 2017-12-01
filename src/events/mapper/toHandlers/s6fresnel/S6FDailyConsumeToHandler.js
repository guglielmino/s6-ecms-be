const S6FDailyConsumeToHandler = e => ({
  timestamp: e.Payload.timestamp,
  gateway: e.GatewayId,
  deviceId: e.Payload.deviceId,
  dailyconsume: parseFloat(e.Payload.value),
});

export default S6FDailyConsumeToHandler;
