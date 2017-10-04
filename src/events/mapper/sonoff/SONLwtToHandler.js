const SONLwtToHandler = e => ({
  deviceId: e.Payload.DeviceId,
  status: e.Payload.Status,
});

export default SONLwtToHandler;
