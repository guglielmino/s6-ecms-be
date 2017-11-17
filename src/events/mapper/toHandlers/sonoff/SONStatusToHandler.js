const SONStatusToHandler = e => ({
  deviceId: e.Payload.DeviceId,
  powerStatus: e.Payload.Power.toLowerCase(),
});

export default SONStatusToHandler;
