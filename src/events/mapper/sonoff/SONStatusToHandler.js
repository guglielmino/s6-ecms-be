const SONStatusToHandler = e => ({
  deviceId: e.Payload.DeviceId,
  powerStatus: e.Payload.Power,
});

export default SONStatusToHandler;
