const S6FValuesToHandler = e => ({
  timestamp: e.Payload.timestamp,
  gateway: e.GatewayId,
  type: e.Type,
  deviceId: e.Payload.deviceId,
  value: e.Payload.value,
  unit: e.Payload.unit,
});

export default S6FValuesToHandler;
